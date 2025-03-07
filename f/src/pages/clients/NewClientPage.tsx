import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface ClientFormData {
  name: string;
  email: string;
  code: string;
  vat_code: string;
  phone: string;
}

const NewClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    code: '',
    vat_code: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Здесь будет запрос к API для создания клиента
      // const response = await axios.post('/api/clients', formData);

      // Имитация успешного запроса
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate('/clients');
    } catch (err) {
      setError('Failed to create client. Please try again.');
      console.error('Error creating client:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <Link
            to="/clients"
            className="inline-flex items-center text-[#f7931e] hover:text-[#e67e00]"
          >
            <FaArrowLeft className="mr-2" />
            Back to Clients
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Client
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                />
              </div>

              <div>
                <label
                  htmlFor="vat_code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  VAT Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="vat_code"
                  type="text"
                  name="vat_code"
                  value={formData.vat_code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#f7931e] focus:border-[#f7931e]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/clients')}
                className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f7931e]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-[#f7931e] hover:bg-[#e67e00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f7931e] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewClientPage;
