const express = require('express');
const router = express.Router();
const db = require('../db');

// Create new invoice
router.post('/', async (req, res) => {
    const { billNo, customerName, billDate, phoneNo, items, totalAmount } = req.body;
    
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Insert invoice
        const [invoiceResult] = await connection.execute(
            'INSERT INTO invoices (bill_no, customer_name, bill_date, phone_no, total_amount) VALUES (?, ?, ?, ?, ?)',
            [billNo, customerName, billDate, phoneNo, totalAmount]
        );
        
        const invoiceId = invoiceResult.insertId;
        
        // Insert items
        for (const item of items) {
            await connection.execute(
                'INSERT INTO invoice_items (invoice_id, item_name, rate, quantity, gst, amount) VALUES (?, ?, ?, ?, ?, ?)',
                [invoiceId, item.itemName, item.rate, item.quantity, item.gst, item.amount]
            );
        }
        
        await connection.commit();
        res.status(201).json({ message: 'Invoice created successfully', invoiceId });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    } finally {
        connection.release();
    }
});

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const [invoices] = await db.execute(`
            SELECT i.*, 
                   JSON_ARRAYAGG(
                       JSON_OBJECT(
                           'itemName', ii.item_name,
                           'rate', ii.rate,
                           'quantity', ii.quantity,
                           'gst', ii.gst,
                           'amount', ii.amount
                       )
                   ) as items
            FROM invoices i
            LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
            GROUP BY i.id
            ORDER BY i.created_at DESC
        `);
        
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// Get single invoice
router.get('/:id', async (req, res) => {
    try {
        const [invoices] = await db.execute(
            'SELECT * FROM invoices WHERE id = ?',
            [req.params.id]
        );
        
        if (invoices.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        
        const [items] = await db.execute(
            'SELECT * FROM invoice_items WHERE invoice_id = ?',
            [req.params.id]
        );
        
        res.json({ ...invoices[0], items });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
});

module.exports = router;