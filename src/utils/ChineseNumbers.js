class ChineseNumbers {
    static toChineseNumber(num) {
        const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const units = ['', '十', '百', '千'];
        
        if (num === 0) return chineseNums[0];
        if (num < 10) return chineseNums[num];
        
        if (num < 20) {
            if (num === 10) return '十';
            return '十' + chineseNums[num - 10];
        }
        
        if (num < 100) {
            const tens = Math.floor(num / 10);
            const ones = num % 10;
            if (ones === 0) {
                return chineseNums[tens] + '十';
            }
            return chineseNums[tens] + '十' + chineseNums[ones];
        }
        
        if (num < 1000) {
            const hundreds = Math.floor(num / 100);
            const remainder = num % 100;
            let result = chineseNums[hundreds] + '百';
            
            if (remainder > 0) {
                if (remainder < 10) {
                    result += '零' + chineseNums[remainder];
                } else {
                    const tens = Math.floor(remainder / 10);
                    const ones = remainder % 10;
                    if (tens > 0) {
                        result += chineseNums[tens] + '十';
                    } else {
                        result += '零';
                    }
                    if (ones > 0) {
                        result += chineseNums[ones];
                    }
                }
            }
            return result;
        }
        
        return num.toString();
    }
}