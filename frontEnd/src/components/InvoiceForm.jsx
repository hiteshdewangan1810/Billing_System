import React, { useState } from 'react';
import axios from 'axios';

const InvoiceForm = () => {
    const [formData, setFormData] = useState({
        billNo: '',
        customerName: '',
        billDate: '',
        phoneNo: '+91 '
    });

    const [items, setItems] = useState([
        { id: 1, itemName: '', rate: 0, quantity: 1, gst: 18, amount: 0 }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    // Calculate amount for an item
    const calculateAmount = (rate, quantity, gst) => {
        const subtotal = rate * quantity;
        const gstAmount = (subtotal * gst) / 100;
        return subtotal + gstAmount;
    };

    // Update item and recalculate
    const updateItem = (id, field, value) => {
        setItems(prevItems => 
            prevItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'rate' || field === 'quantity' || field === 'gst') {
                        updatedItem.amount = calculateAmount(
                            field === 'rate' ? parseFloat(value) || 0 : updatedItem.rate,
                            field === 'quantity' ? parseInt(value) || 0 : updatedItem.quantity,
                            field === 'gst' ? parseFloat(value) || 0 : updatedItem.gst
                        );
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    // Add new item
    const addItem = () => {
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        setItems([...items, {
            id: newId,
            itemName: '',
            rate: 0,
            quantity: 1,
            gst: 18,
            amount: 0
        }]);
    };

    // Delete item
    const deleteItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    // Calculate total amount
    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.amount || 0), 0);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            billNo: '#INV-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
            customerName: '',
            billDate: '',
            phoneNo: ''
        });
        setItems([{
            id: 1,
            itemName: '',
            rate: 0,
            quantity: 1,
            gst: 18,
            amount: 0
        }]);
        setMessage(null);
    };

    // Submit invoice
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        // Validation
        if (!formData.customerName.trim()) {
            setMessage({ type: 'error', text: 'Please enter customer name' });
            setIsSubmitting(false);
            return;
        }

        if (!formData.billDate) {
            setMessage({ type: 'error', text: 'Please select bill date' });
            setIsSubmitting(false);
            return;
        }

        const invalidItems = items.filter(item => !item.itemName.trim() || item.rate <= 0 || item.quantity <= 0);
        if (invalidItems.length > 0) {
            setMessage({ type: 'error', text: 'Please fill all item details correctly' });
            setIsSubmitting(false);
            return;
        }

        const invoiceData = {
            billNo: formData.billNo,
            customerName: formData.customerName,
            billDate: formData.billDate,
            phoneNo: formData.phoneNo,
            items: items.map(({ id, ...rest }) => rest),
            totalAmount: calculateTotal()
        };
//         try {
//     const response = await axios.post('http://localhost:5000/api/invoices', invoiceData);
//     setMessage({ type: 'success', text: 'Invoice submitted successfully!' });
//     resetForm();
// } catch (error) {
//     console.error('Error submitting invoice:', error);
//     setMessage({ type: 'error', text: 'Failed to submit invoice. Please try again.' });
// } finally {
//     setIsSubmitting(false);
// }
        try {
            const response = await axios.post('http://localhost:5000/api/invoices', invoiceData);
            setMessage({ type: 'success', text: 'Invoice submitted successfully!' });
            resetForm();
        } catch (error) {
            console.error('Error submitting invoice:', error);
            setMessage({ type: 'error', text: 'Failed to submit invoice. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Invoice Application</h1>
                <p className="text-gray-500">Create professional invoices</p>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Bill Information */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Bill Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill No.</label>
                            <input
                                type="text"
                                name="billNo"
                                placeholder='001'
                                value={formData.billNo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <input
                                type="text"
                                name="customerName"
                                placeholder='Harsh'
                                value={formData.customerName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bill Date</label>
                            <input
                                type="date"
                                name="billDate"
                                value={formData.billDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone No.</label>
                            <input
                                type="number"
                                name="phoneNo"
                                placeholder='+91 9999999999'
                                value={formData.phoneNo}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Invoice Items</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">Item Name</th>
                                    <th className="p-2 text-left">Rate (₹)</th>
                                    <th className="p-2 text-left">Quantity</th>
                                    <th className="p-2 text-left">GST (%)</th>
                                    <th className="p-2 text-left">Amount (₹)</th>
                                    <th className="p-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={item.itemName}
                                                onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded"
                                                placeholder="Product name"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.rate}
                                                onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <select
                                                value={item.gst}
                                                onChange={(e) => updateItem(item.id, 'gst', parseFloat(e.target.value))}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded"
                                            >
                                                <option value="0">0%</option>
                                                <option value="5">5%</option>
                                                <option value="12">12%</option>
                                                <option value="18">18%</option>
                                                <option value="28">28%</option>
                                            </select>
                                        </td>
                                        <td className="p-2">
                                            <span className="font-medium">₹{item.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="p-2">
                                            <button
                                                type="button"
                                                onClick={() => deleteItem(item.id)}
                                                className="text-red-600 hover:text-red-800"
                                                disabled={items.length === 1}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + Add Item
                    </button>
                </div>

                {/* Total Amount */}
                <div className="text-right mb-6">
                    <div className="text-xl font-bold">
                        Total Amount: <span className="text-green-600">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Invoice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceForm;