app.post('/cart/add', (req, res) => {
    const { item } = req.body;
    if (!item) {
        return res.status(400).json({ message: 'Item é obrigatório.' });
    }

    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    // Verifica se o item já existe no carrinho
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += item.quantity || 1;
    } else {
        cart.push({ ...item, quantity: item.quantity || 1 });
    }

    res.cookie('cart', JSON.stringify(cart), { httpOnly: true, secure: false });
    return res.status(200).json({ message: 'Item adicionado ao carrinho', cart });
});
