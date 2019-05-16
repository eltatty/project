const servUrl = () => {
    const urls = [3, 4, 5, 6, 7]
    const number1 = urls [Math.floor(Math.random() * urls.length)]
    var same = 1
    while( same ) {
        var number2 = urls [Math.floor(Math.random() * urls.length)]
        if (number1 != number2) {
            same = 0
        }
    }
    
    return { number1, number2 }

}

module.exports = servUrl