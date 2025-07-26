// Простой companyService для тестирования
export const companyService = {
  getCompanies: async () => {
    // TODO: Реальный API вызов
    return [];
  },
  
  getCurrentCompany: async () => {
    // TODO: Реальный API вызов
    return null;
  },

  // Метод для выбора компании
  selectCompany: async (companyId: number) => {
    try {
      // TODO: Реальный API вызов для переключения на компанию
      localStorage.setItem('selectedCompanyId', companyId.toString());
      
      // Имитируем переход на company dashboard
      window.location.href = '/dashboard';
      
      return { success: true, companyId };
    } catch (error) {
      throw new Error('Failed to select company');
    }
  }
};

export default companyService;