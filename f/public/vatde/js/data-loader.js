/**
 * IT AI SOLAR Dashka SmartStb - Data Loader
 * Модуль загрузки и управления данными компаний
 * @author Jimmy & Dasha's Team
 * @version 2.0
 */

class DataLoader {
    constructor() {
        this.companiesData = null;
        this.currentCompany = 'ASSET_LOGISTICS';
    }

    /**
     * Инициализация загрузчика данных
     */
    async init() {
        try {
            await this.loadCompaniesData();
            this.setupCompanySelector();
            console.log('📊 Data Loader initialized');
        } catch (error) {
            console.warn('⚠️ Could not load companies data, using defaults');
            this.loadDefaultData();
        }
    }

    /**
     * Загрузка данных компаний из JSON
     */
    async loadCompaniesData() {
        try {
            const response = await fetch('./data/companies.json');
            this.companiesData = await response.json();
        } catch (error) {
            throw new Error('Failed to load companies data');
        }
    }

    /**
     * Настройка селектора компаний
     */
    setupCompanySelector() {
        // Добавляем селектор компаний в header если его нет
        const header = document.querySelector('.header');
        if (header && this.companiesData && !document.getElementById('companySelector')) {
            const selectorHTML = `
                <div style="margin-top: 15px;">
                    <select id="companySelector" style="
                        padding: 8px 12px; 
                        border-radius: 6px; 
                        border: 2px solid #1976d2;
                        background: white;
                        font-weight: bold;
                    ">
                        ${Object.keys(this.companiesData.companies).map(key => 
                            `<option value="${key}">${this.companiesData.companies[key].name}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
            header.insertAdjacentHTML('beforeend', selectorHTML);
            
            // Обработчик изменения компании
            document.getElementById('companySelector').addEventListener('change', (e) => {
                this.loadCompanyData(e.target.value);
            });
        }
    }

    /**
     * Загрузка данных конкретной компании
     */
    loadCompanyData(companyKey) {
        if (!this.companiesData || !this.companiesData.companies[companyKey]) {
            console.warn(`Company ${companyKey} not found`);
            return;
        }

        const company = this.companiesData.companies[companyKey];
        this.currentCompany = companyKey;

        // Обновляем информацию о компании
        this.updateCompanyInfo(company);

        // Загружаем данные в калькулятор
        if (window.vatCalculator && company.vatData) {
            Object.entries(company.vatData).forEach(([fieldId, value]) => {
                window.vatCalculator.setFieldValue(fieldId, value);
            });

            window.vatCalculator.updateTotal81();
            window.vatCalculator.updateTotal41();
        }
    }

    /**
     * Обновление информации о компании в интерфейсе
     */
    updateCompanyInfo(company) {
        const companyInfoDiv = document.querySelector('.company-info');
        if (companyInfoDiv) {
            companyInfoDiv.innerHTML = `
                <strong>📋 Компания:</strong> ${company.name}<br>
                <strong>📍 Адрес:</strong> ${company.address}<br>
                <strong>🏛️ HRB:</strong> ${company.hrb}<br>
                <strong>🔢 Steuernummer:</strong> ${company.steuernummer}<br>
                <strong>📅 Meldezeitraum:</strong> ${company.period || 'März 2025'}
            `;
        }

        // Обновляем заголовок
        const headerH2 = document.querySelector('.header h2');
        if (headerH2) {
            headerH2.textContent = `Umsatzsteuervoranmeldung - ${company.name}`;
        }
    }

    /**
     * Загрузка данных по умолчанию
     */
    loadDefaultData() {
        const defaultCompany = {
            name: 'ASSET LOGISTICS GMBH',
            address: 'Kurze Straße 6, 06366 Köthen',
            hrb: '34481',
            steuernummer: 'DE453202061',
            period: 'März 2025',
            vatData: {
                field10: 0,
                field81a: 0.00,
                field81b: 133.56,
                field41a: 18400.00,
                field41b: 0.00,
                field43: 0.00,
                field66: 25.38,
                field62: 3085.59,
                field67: 0.00
            }
        };

        this.updateCompanyInfo(defaultCompany);

        // Загружаем данные в калькулятор
        if (window.vatCalculator) {
            Object.entries(defaultCompany.vatData).forEach(([fieldId, value]) => {
                window.vatCalculator.setFieldValue(fieldId, value);
            });

            window.vatCalculator.updateTotal81();
            window.vatCalculator.updateTotal41();
        }
    }

    /**
     * Сохранение текущих данных
     */
    saveCurrentData() {
        if (!window.vatCalculator) return null;

        return {
            company: this.currentCompany,
            timestamp: new Date().toISOString(),
            data: window.vatCalculator.exportData()
        };
    }

    /**
     * Экспорт конфигурации для добавления новой компании
     */
    exportCompanyTemplate() {
        const template = {
            "COMPANY_KEY": {
                "name": "COMPANY NAME",
                "address": "Address",
                "hrb": "HRB Number",
                "steuernummer": "DE000000000",
                "period": "März 2025",
                "vatData": {
                    "field10": 0,
                    "field81a": 0.00,
                    "field81b": 0.00,
                    "field41a": 0.00,
                    "field41b": 0.00,
                    "field43": 0.00,
                    "field66": 0.00,
                    "field62": 0.00,
                    "field67": 0.00
                }
            }
        };

        const jsonString = JSON.stringify(template, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'company_template.json');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
}

// Глобальный экземпляр
let dataLoader;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    dataLoader = new DataLoader();
    // Даем время на инициализацию других модулей
    setTimeout(() => {
        dataLoader.init();
    }, 200);
});
