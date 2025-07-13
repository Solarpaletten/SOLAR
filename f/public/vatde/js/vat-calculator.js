/**
 * IT AI SOLAR Dashka SmartStb - VAT Calculator Module
 * Модуль расчета НДС для немецких деклараций
 * @author Dasha's Team & Jimmy
 * @version 2.0
 */

class VATCalculator {
    constructor() {
        this.vatRate19 = 0.19;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.setupEventListeners();
        this.loadDefaultData();
        this.initialized = true;
        console.log('🚀 VAT Calculator initialized');
    }

    setupEventListeners() {
        const inputFields = [
            'field81a', 'field81b', 'field41a', 'field41b', 
            'field43', 'field66', 'field62', 'field67'
        ];

        inputFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.addEventListener('input', () => this.handleInputChange(fieldId));
            }
        });
    }

    handleInputChange(fieldId) {
        if (fieldId === 'field81a' || fieldId === 'field81b') {
            this.updateTotal81();
        } else if (fieldId === 'field41a' || fieldId === 'field41b') {
            this.updateTotal41();
        } else {
            this.calculateTax();
        }
    }

    getFieldValue(fieldId) {
        const element = document.getElementById(fieldId);
        return parseFloat(element?.value) || 0;
    }

    setFieldValue(fieldId, value) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = value.toFixed(2);
        }
    }

    updateTotal81() {
        const field81a = this.getFieldValue('field81a');
        const field81b = this.getFieldValue('field81b');
        const total81 = field81a + field81b;
        
        this.setFieldValue('field81', total81);
        
        const vat81c = field81a * this.vatRate19;
        this.setFieldValue('field81c', vat81c);
        
        this.calculateTax();
    }

    updateTotal41() {
        const field41a = this.getFieldValue('field41a');
        const field41b = this.getFieldValue('field41b');
        const total41 = field41a + field41b;
        
        this.setFieldValue('field41', total41);
        
        const vat41c = field41b * this.vatRate19;
        this.setFieldValue('field41c', vat41c);
        
        this.calculateTax();
    }

    calculateTax() {
        const field81a = this.getFieldValue('field81a');
        const field41b = this.getFieldValue('field41b');
        
        const vat81c = field81a * this.vatRate19;
        const vat41c = field41b * this.vatRate19;
        const totalOutputVat = vat41c;
        
        this.setFieldValue('field81c', vat81c);
        this.setFieldValue('field41c', vat41c);
        
        const inputVat66 = this.getFieldValue('field66');
        const inputVat62 = this.getFieldValue('field62');
        const inputVat67 = this.getFieldValue('field67');
        const totalInputVat = inputVat66 + inputVat62 + inputVat67;
        
        const balance = totalOutputVat - totalInputVat;
        this.setFieldValue('field83', balance);
        
        this.calculateProfit();
        this.renderResult(balance, vat81c, vat41c, totalOutputVat, totalInputVat);
        
        return {
            balance,
            vat81c,
            vat41c,
            totalOutputVat,
            totalInputVat
        };
    }

    calculateProfit() {
        const revenue41 = this.getFieldValue('field41');
        const costs81 = this.getFieldValue('field81');
        const plannedProfit = revenue41 - costs81;
        
        this.setFieldValue('plannedProfit', plannedProfit);
        
        const profitBreakdown = document.getElementById('profitBreakdown');
        if (profitBreakdown) {
            const profitColor = plannedProfit >= 0 ? '#388e3c' : '#d32f2f';
            const profitIcon = plannedProfit >= 0 ? '📈' : '📉';
            
            profitBreakdown.innerHTML = `
                Выручка (41): <strong style="color: #388e3c;">${revenue41.toFixed(2)} €</strong><br>
                Затраты (81): <strong style="color: #d32f2f;">${costs81.toFixed(2)} €</strong><br>
                ${profitIcon} <strong style="color: ${profitColor};">Плановая прибыль: ${plannedProfit.toFixed(2)} €</strong>
            `;
        }
        
        return plannedProfit;
    }

    renderResult(balance, vat81c, vat41c, totalOutputVat, totalInputVat) {
        const resultDiv = document.getElementById('result');
        const resultText = document.getElementById('resultText');
        
        if (!resultDiv || !resultText) return;
        
        const field81a = this.getFieldValue('field81a');
        const field41b = this.getFieldValue('field41b');
        const revenue41 = this.getFieldValue('field41');
        const costs81 = this.getFieldValue('field81');
        const plannedProfit = revenue41 - costs81;
        
        let statusHTML = '';
        let statusColor = '';
        
        if (balance > 0) {
            statusHTML = `💸 К ДОПЛАТЕ: ${balance.toFixed(2)} €`;
            statusColor = '#d32f2f';
        } else if (balance < 0) {
            statusHTML = `💰 К ВОЗВРАТУ: ${Math.abs(balance).toFixed(2)} €`;
            statusColor = '#388e3c';
        } else {
            statusHTML = `⚖️ БАЛАНС: 0.00 €`;
            statusColor = '#1976d2';
        }
        
        resultText.innerHTML = `
            <strong style="color: ${statusColor}; font-size: 20px;">${statusHTML}</strong><br><br>
            <div style="text-align: left; background: #f5f5f5; padding: 15px; border-radius: 8px;">
                📊 <strong>Расчет:</strong><br>
                81c (19% с ${field81a.toFixed(2)}€): ${vat81c.toFixed(2)} € <em>(не учитывается в 83)</em><br>
                41c (19% с ${field41b.toFixed(2)}€): <strong>${vat41c.toFixed(2)} €</strong><br>
                <em>Начисленный НДС для 83: ${totalOutputVat.toFixed(2)} €</em><br><br>
                Зачетный НДС (66+62+67): <strong>${totalInputVat.toFixed(2)} €</strong><br><br>
                <strong>83 = ${totalOutputVat.toFixed(2)} - ${totalInputVat.toFixed(2)} = ${balance.toFixed(2)} €</strong><br><br>
                📈 <strong>Плановая прибыль:</strong> ${plannedProfit.toFixed(2)} € (выручка ${revenue41.toFixed(2)} € - затраты ${costs81.toFixed(2)} €)
            </div>
        `;
        
        resultDiv.style.display = 'block';
    }

    loadDefaultData() {
        const defaultData = {
            field10: 0,
            field81a: 0.00,
            field81b: 133.56,
            field41a: 18400.00,
            field41b: 0.00,
            field43: 0.00,
            field66: 25.38,
            field62: 3085.59,
            field67: 0.00
        };

        Object.entries(defaultData).forEach(([fieldId, value]) => {
            this.setFieldValue(fieldId, value);
        });

        this.updateTotal81();
        this.updateTotal41();
    }

    exportData() {
        return {
            company: {
                name: 'ASSET LOGISTICS GMBH',
                address: 'Kurze Straße 6, 06366 Köthen',
                hrb: '34481',
                steuernummer: 'DE453202061'
            },
            period: 'März 2025',
            timestamp: new Date().toISOString(),
            software: 'IT AI SOLAR Dashka SmartStb',
            data: {
                field10: this.getFieldValue('field10'),
                field81a: this.getFieldValue('field81a'),
                field81b: this.getFieldValue('field81b'),
                field81: this.getFieldValue('field81'),
                field81c: this.getFieldValue('field81c'),
                field41a: this.getFieldValue('field41a'),
                field41b: this.getFieldValue('field41b'),
                field41: this.getFieldValue('field41'),
                field41c: this.getFieldValue('field41c'),
                field43: this.getFieldValue('field43'),
                field66: this.getFieldValue('field66'),
                field62: this.getFieldValue('field62'),
                field67: this.getFieldValue('field67'),
                field83: this.getFieldValue('field83'),
                plannedProfit: this.getFieldValue('plannedProfit')
            },
            calculations: this.calculateTax()
        };
    }
}

// Глобальные функции
let vatCalculator;

function updateTotal81() {
    vatCalculator?.updateTotal81();
}

function updateTotal41() {
    vatCalculator?.updateTotal41();
}

function calculateTax() {
    return vatCalculator?.calculateTax();
}

function loadRealData() {
    vatCalculator?.loadDefaultData();
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    vatCalculator = new VATCalculator();
    vatCalculator.init();
});
