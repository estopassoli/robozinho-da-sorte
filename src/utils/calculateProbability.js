function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

function combination(n, r) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function calculateProbability(meusNumeros, totalNumeros, maxNumeros) {
    const totalCombinations = combination(totalNumeros, maxNumeros);
    const number_of_combinations_in_meusNumeros = meusNumeros.length;
    const probability = number_of_combinations_in_meusNumeros / totalCombinations;

    // Convertendo a probabilidade para porcentagem e formatando para 6 casas decimais
    return (probability * 100).toFixed(6) + '%';
}


module.exports = calculateProbability;