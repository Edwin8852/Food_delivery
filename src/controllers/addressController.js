import pool from '../config/dbPool.js';

// GET /api/address/user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [userId]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/address/add
export const createAddress = async (req, res) => {
  const { 
    title, street1, street2, landmark, city, state, postalCode, 
    contactName, contactNumber, latitude, longitude, isDefault 
  } = req.body;
  const userId = req.user.id;

  try {
    // If setting as default, unset others first
    if (isDefault) {
      await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    const query = `
      INSERT INTO addresses 
      (user_id, title, street1, street2, landmark, city, state, postal_code, contact_name, contact_number, latitude, longitude, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId, title, street1, street2, landmark, city, state, postalCode,
      contactName, contactNumber, latitude, longitude, isDefault || false
    ]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/address/:id
export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { 
    title, street1, street2, landmark, city, state, postalCode, 
    contactName, contactNumber, latitude, longitude, isDefault 
  } = req.body;
  const userId = req.user.id;

  try {
    if (isDefault) {
      await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [userId]);
    }

    const query = `
      UPDATE addresses 
      SET title=$1, street1=$2, street2=$3, landmark=$4, city=$5, state=$6, 
          postal_code=$7, contact_name=$8, contact_number=$9, latitude=$10, longitude=$11, is_default=$12
      WHERE id=$13 AND user_id=$14
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      title, street1, street2, landmark, city, state, postalCode,
      contactName, contactNumber, latitude, longitude, isDefault, id, userId
    ]);

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/address/:id
export const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    await pool.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [id, userId]);
    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
