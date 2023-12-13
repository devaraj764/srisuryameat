const fs = require('fs');
const path = require('path');

function convertToJSON() {
    try {
        const filePath = path.join(__dirname, 'data.txt');
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const items = fileData.split('---\n').filter(item => item.trim() !== '');
        const data = items.map(item => {
            const lines = item.trim().split('\n');
            const category = lines[0].split(':')[1].trim()
            lines.splice(0, 2);
            const categoryItems = lines.map(line => {
                const [name, priceString] = line.trim().split('=');
                const priceArr = priceString.trim().split(' ').map(price => parseInt(price, 10));
                const units = ['kg', 'g']
                const quantites = [1, 500]
                const prices = priceArr.map((price, index) => {
                    return {
                        quantity: quantites[index], units: units[index], price
                    }
                })
                return {
                    name: name.trim(),
                    category,
                    thumbnail:'',
                    prices
                };
            });
            return categoryItems;
        }).flat();
        console.log(data.length)

        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync('data.json', jsonData);
        console.log('Conversion successful! Data written to data.json');
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

convertToJSON();
