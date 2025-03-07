import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Client {
  id: number;
  registrationDate: string;
  name: string;
  code: string;
  vat_code: string;
  phone: string;
  email: string;
}

// Моковые данные для отображения интерфейса
const mockClients: Client[] = [
  {
    id: 1,
    registrationDate: '24.10.2024',
    name: 'SOLAR',
    code: '-',
    vat_code: '-',
    phone: '+4915394807778',
    email: 'solar@gmail.com',
  },
  {
    id: 2,
    registrationDate: '24.10.2024',
    name: 'SOLAR GMBH',
    code: '-',
    vat_code: '-',
    phone: '+49163',
    email: 'solar@gmail.com',
  },
  {
    id: 3,
    registrationDate: '24.10.2024',
    name: 'SOL',
    code: '-',
    vat_code: '-',
    phone: '+1',
    email: 'sol@sol.com',
  },
  {
    id: 4,
    registrationDate: '24.10.2024',
    name: 'ill',
    code: '-',
    vat_code: '-',
    phone: 'nn',
    email: 'mmm@jj',
  },
  {
    id: 5,
    registrationDate: '24.10.2024',
    name: 'SL',
    code: '-',
    vat_code: '-',
    phone: '+34',
    email: 'sao@sl.eu',
  },
  {
    id: 6,
    registrationDate: '24.10.2024',
    name: 'US',
    code: '-',
    vat_code: '-',
    phone: '+49',
    email: 'us@us.eu',
  },
  {
    id: 7,
    registrationDate: '24.10.2024',
    name: 'GH',
    code: '-',
    vat_code: '-',
    phone: '+49',
    email: 'gh@gh.de',
  },
  {
    id: 8,
    registrationDate: '27.10.2024',
    name: 'SIA UCO',
    code: '4032034567',
    vat_code: 'LV4032034567',
    phone: '+37125',
    email: 'sia@siauco.lv',
  },
];

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients] = useState<Client[]>(mockClients);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(clients.map((client) => client.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectClient = (clientId: number) => {
    if (selectedClientIds.includes(clientId)) {
      setSelectedClientIds(selectedClientIds.filter((id) => id !== clientId));
    } else {
      setSelectedClientIds([...selectedClientIds, clientId]);
    }
  };

  const handleClientClick = (clientId: number) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/clients/new')}
            className="h-9 w-9 bg-[#f7931e] text-white rounded flex items-center justify-center hover:bg-[#e67e00]"
          >
            <FaPlus />
          </button>
          {selectedClientIds.length === 1 && (
            <button
              onClick={() => navigate(`/clients/${selectedClientIds[0]}/edit`)}
              className="h-9 w-9 bg-[#f7931e] text-white rounded flex items-center justify-center hover:bg-[#e67e00]"
            >
              <FaEdit />
            </button>
          )}
          {selectedClientIds.length > 0 && (
            <button className="h-9 w-9 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600">
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-10 bg-white rounded shadow">
          <p className="text-gray-500">No clients yet.</p>
          <button
            onClick={() => navigate('/clients/new')}
            className="mt-4 px-4 py-2 bg-[#f7931e] text-white rounded hover:bg-[#e67e00]"
          >
            Add Client
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#f7931e] focus:ring-[#f7931e]"
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Registration date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    VAT code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className={`${selectedClientIds.includes(client.id) ? 'bg-orange-50' : ''} hover:bg-gray-50 cursor-pointer`}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedClientIds.includes(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#f7931e] focus:ring-[#f7931e]"
                      />
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => handleClientClick(client.id)}
                    >
                      {client.registrationDate}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => handleClientClick(client.id)}
                    >
                      <span className="text-sm font-medium text-gray-900 hover:text-[#f7931e]">
                        {client.name}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => handleClientClick(client.id)}
                    >
                      {client.code}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => handleClientClick(client.id)}
                    >
                      {client.vat_code}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => handleClientClick(client.id)}
                    >
                      {client.phone}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => handleClientClick(client.id)}
                    >
                      {client.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
