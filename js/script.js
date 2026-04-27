let grafico = null;

// INSS 
function calcularINSS(salario) {
    let inss = 0;

    const faixas = [
        { limite: 1320, taxa: 0.075 },
        { limite: 2571.29, taxa: 0.09 },
        { limite: 3856.94, taxa: 0.12 },
        { limite: 7507.49, taxa: 0.14 }
    ];

    let anterior = 0;

    for (let i = 0; i < faixas.length; i++) {
        if (salario > faixas[i].limite) {
            inss += (faixas[i].limite - anterior) * faixas[i].taxa;
            anterior = faixas[i].limite;
        } else {
            inss += (salario - anterior) * faixas[i].taxa;
            return inss;
        }
    }

    return inss;
}

function calcular() {

    let bruto = Number(document.getElementById('salario').value);
    let pensao = Number(document.getElementById('pensao').value) || 0;
    let dep = Number(document.getElementById('dep').value) || 0;

    if (!bruto || bruto <= 0) {
        alert("Digite um salário válido!");
        return;
    }

    // CÁLCULOS 
    let inss = calcularINSS(bruto);
    let deducaoDep = dep * 189.59;

    let base = bruto - inss - pensao - deducaoDep;
    if (base < 0) base = 0;

    let imposto = 0;

    //  IRRF - TABELA 2026 
    if (base <= 2428.80) {
        imposto = 0;
    } else if (base <= 2826.65) {
        imposto = (base * 0.075) - 182.16;
    } else if (base <= 3751.05) {
        imposto = (base * 0.15) - 394.16;
    } else if (base <= 4664.68) {
        imposto = (base * 0.225) - 675.49;
    } else {
        imposto = (base * 0.275) - 908.73;
    }

    // AJUSTES
    imposto = Math.round(imposto * 100) / 100;
    if (imposto < 0) imposto = 0;

    let liquido = bruto - inss - imposto;
    let deducaoTotal = inss + pensao + deducaoDep;

    let aliquotaEfetiva = (imposto / bruto) * 100;

    // RESULTADO
    document.getElementById('resultado').innerHTML = `
        <strong>IRRF: R$ ${imposto.toFixed(2)}</strong><br>
        INSS: R$ ${inss.toFixed(2)}<br>
        Base: R$ ${base.toFixed(2)}<br>
        Deduções: R$ ${deducaoTotal.toFixed(2)}<br>
        Líquido: R$ ${liquido.toFixed(2)}<br>
        Alíquota efetiva: ${aliquotaEfetiva.toFixed(2)}%
    `;

    // GRÁFICO 
    const ctx = document.getElementById('grafico').getContext('2d');

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['INSS', 'IRRF', 'Líquido'],
            datasets: [{
                data: [inss, imposto, liquido],
                backgroundColor: ['#f2978b', '#ff6b6b', '#97221a'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        }
    });
}