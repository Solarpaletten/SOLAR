/**
 * IT AI SOLAR Dashka SmartStb - Export Manager
 * Модуль экспорта данных в различные форматы
 * @author Jimmy & Dasha's Team
 * @version 2.0
 */

class ExportManager {
    constructor(vatCalculator) {
        this.vatCalculator = vatCalculator;
    }

    /**
     * Печать декларации
     */
    printDeclaration() {
        const exportSection = document.querySelector('.section:last-child');
        if (exportSection) {
            exportSection.style.display = 'none';
        }
        
        window.print();
        
        setTimeout(() => {
            if (exportSection) {
                exportSection.style.display = 'block';
            }
        }, 1000);
    }

    /**
     * Экспорт в PDF
     */
    exportToPDF() {
        alert('📄 Функция экспорта в PDF:\n\nВ реальном проекте здесь будет использоваться библиотека jsPDF для создания PDF файла с данными декларации.\n\nПока можно использовать функцию печати браузера и сохранить как PDF.');
        this.printDeclaration();
    }

    /**
     * Экспорт в Excel (CSV)
     */
    exportToExcel() {
        const data = this.vatCalculator.exportData();
        
        const csvData = [
            ['IT AI SOLAR Dashka SmartStb - Umsatzsteuervoranmeldung März 2025'],
            ['ASSET LOGISTICS GMBH'],
            [''],
            ['Поле', 'Описание', 'Сумма (€)'],
            ['10', 'Berichtigte Anmeldung', data.data.field10],
            [''],
            ['КОД 81 - Steuerpflichtige Umsätze'],
            ['81a', 'Товары/услуги С НДС', data.data.field81a],
            ['81b', 'Товары/услуги БЕЗ НДС', data.data.field81b],
            ['81', 'ИТОГО код 81', data.data.field81],
            ['81c', 'НДС81', data.data.field81c],
            [''],
            ['КОД 41 - Поставки клиентам'],
            ['41a', 'Внутриевропейские поставки', data.data.field41a],
            ['41b', 'Внутренние поставки с НДС', data.data.field41b],
            ['41', 'ИТОГО код 41', data.data.field41],
            ['41c', 'НДС41', data.data.field41c],
            [''],
            ['43', 'Экспорт в третьи страны', data.data.field43],
            [''],
            ['Зачетный НДС'],
            ['66', 'НДС по счетам поставщиков', data.data.field66],
            ['62', 'Уплаченный импортный НДС', data.data.field62],
            ['67', 'НДС внутриевропейские', data.data.field67],
            [''],
            ['ИТОГО'],
            ['83', 'К доплате/возврату', data.data.field83],
            ['PROFIT', 'Плановая прибыль', data.data.plannedProfit],
            [''],
            ['Дата создания:', new Date().toLocaleString('ru-RU')]
        ];

        this.downloadCSV(csvData, 'VAT_Declaration_März_2025.csv');
        alert('📊 Данные экспортированы в CSV формат!\n\nФайл можно открыть в Excel.');
    }

    /**
     * Экспорт в JSON
     */
    exportToJSON() {
        const exportData = this.vatCalculator.exportData();
        const jsonString = JSON.stringify(exportData, null, 2);
        
        this.downloadFile(jsonString, 'VAT_Declaration_Data_März_2025.json', 'application/json');
        alert('💾 Данные экспортированы в JSON!\n\nФайл содержит все данные декларации и может быть использован для импорта в другие системы.');
    }

    /**
     * Скачивание CSV файла
     */
    downloadCSV(data, filename) {
        let csvContent = data.map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        const BOM = '\uFEFF';
        csvContent = BOM + csvContent;

        this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    }

    /**
     * Универсальная функция скачивания файлов
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
}

// Глобальные функции экспорта
let exportManager;

function printDeclaration() {
    exportManager?.printDeclaration();
}

function exportToPDF() {
    exportManager?.exportToPDF();
}

function exportToExcel() {
    exportManager?.exportToExcel();
}

function exportToJSON() {
    exportManager?.exportToJSON();
}

// Инициализация после загрузки VAT Calculator
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.vatCalculator) {
            exportManager = new ExportManager(window.vatCalculator);
            console.log('📊 Export Manager initialized');
        }
    }, 100);
});
