const db = require('../config/db');

/**
 * Submit Public Inquiry
 * POST /api/inquiries (Public)
 */
const createInquiry = async (req, res, next) => {
  try {
    const { user_type, category, name, email, phone, message } = req.body;

    const query = `
      INSERT INTO inquiries (user_type, category, name, email, phone, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_type, category, name, email, phone, message, status, created_at
    `;

    const values = [
      user_type,
      category,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      message.trim()
    ];

    const result = await db.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Our team will contact you shortly.',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Inquiries with Filters, Search, and Pagination
 * GET /api/inquiries (Protected - Admin Only)
 */
const getInquiries = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const userType = req.query.userType || req.query.user_type;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const conditions = [];
    const queryParams = [];
    let paramIdx = 1;

    // Filter by Category
    if (category && category !== 'All' && category !== '') {
      conditions.push(`category = $${paramIdx++}`);
      queryParams.push(category);
    }

    // Filter by User Type
    if (userType && userType !== 'All' && userType !== '') {
      conditions.push(`user_type = $${paramIdx++}`);
      queryParams.push(userType);
    }

    // Search by Name or Phone (Case-insensitive ILIKE)
    if (search && search.trim() !== '') {
      conditions.push(`(name ILIKE $${paramIdx} OR phone ILIKE $${paramIdx})`);
      queryParams.push(`%${search.trim()}%`);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total Count query for pagination metadata
    const countSql = `SELECT COUNT(*) AS total FROM inquiries ${whereClause}`;
    const countResult = await db.query(countSql, queryParams);
    const total = parseInt(countResult.rows[0]?.total || '0', 10);

    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    // Data query using parameterized inputs only
    const dataSql = `
      SELECT id, user_type, category, name, email, phone, message, status, created_at
      FROM inquiries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `;

    const dataParams = [...queryParams, limit, offset];
    const dataResult = await db.query(dataSql, dataParams);

    return res.status(200).json({
      success: true,
      data: dataResult.rows,
      total,
      page,
      totalPages,
      limit
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Inquiry Status
 * PATCH /api/inquiries/:id/status (Protected - Admin Only)
 */
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = `
      UPDATE inquiries
      SET status = $1
      WHERE id = $2
      RETURNING id, user_type, category, name, email, phone, message, status, created_at
    `;

    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiryStatus
};
