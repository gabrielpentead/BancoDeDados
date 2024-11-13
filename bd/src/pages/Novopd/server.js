// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { db, bucket } = require('./firebase');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/products', async (req, res) => {
    try {
      const snapshot = await db.collection('products').get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).send('Error getting products');
    }
  });

  app.post('/products', async (req, res) => {
    const { id, name, price, unit, type, imageFile } = req.body;
    
    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' });
    }
  
    try {
      const blob = bucket.file(`imagespd/${imageFile.name}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: imageFile.mimetype
      });
      
      blobStream.end(imageFile.data);
  
      blobStream.on('finish', async () => {
        const imageUrl = await blob.getSignedUrl({ action: 'read', expires: '01-01-2030' });
        await db.collection('products').add({
          id: parseInt(id),
          image: imageUrl[0],
          name,
          price: parseFloat(price),
          unit,
          type
        });
        res.status(201).send('Product added successfully');
      });
  
      blobStream.on('error', (err) => {
        console.error('Upload error:', err);
        res.status(500).send('Upload error');
      });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).send('Error adding product');
    }
  });

  app.put('/products/:id', async (req, res) => {
    const { id, name, price, unit, type, imageFile } = req.body;
    const productId = req.params.id;
  
    try {
      let imageUrl;
      if (imageFile) {
        const blob = bucket.file(`imagespd/${imageFile.name}`);
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: imageFile.mimetype
        });
  
        blobStream.end(imageFile.data);
        
        blobStream.on('finish', async () => {
          imageUrl = await blob.getSignedUrl({ action: 'read', expires: '01-01-2030' });
          await db.collection('products').doc(productId).update({
            id: parseInt(id),
            image: imageUrl[0],
            name,
            price: parseFloat(price),
            unit,
            type
          });
          res.send('Product updated successfully');
        });
      } else {
        await db.collection('products').doc(productId).update({ id: parseInt(id), name, price: parseFloat(price), unit, type });
        res.send('Product updated successfully');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).send('Error updating product');
    }
  });
  app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
      await db.collection('products').doc(productId).delete();
      res.send('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).send('Error deleting product');
    }
  });
    