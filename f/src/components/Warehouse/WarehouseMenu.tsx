// Создать компонент WarehouseMenu.tsx
const WarehouseMenu = ({ expanded, onToggle, submenuLinkClass }) => {
  const warehouseItems = [
    { path: '/warehouse/sales', label: 'Sales' },
    { path: '/warehouse/client-prices', label: 'Client prices' },
    { path: '/warehouse/automatic-invoicing', label: 'Automatic invoicing' },
    { path: '/warehouse/purchases', label: 'Purchases' },
    { path: '/warehouse/sales-returns', label: 'Sales returns' },
    { path: '/warehouse/remaining-items', label: 'Remaining items' },
    { path: '/warehouse/item-movement', label: 'Item movement' },
    { path: '/warehouse/consignment-balance', label: 'Consignment balance' },
    { path: '/warehouse/stock-taking', label: 'Stock-taking' },
    { path: '/warehouse/revaluation', label: 'Revaluation' },
    {
      path: '/warehouse/internal-movement-confirmation',
      label: 'Internal movement confirmation',
    },
    { path: '/warehouse/e-commerce', label: 'E-commerce' },
    { path: '/warehouse/cash-register-sales', label: 'Cash register sales' },
  ];

  return (
    <li>
      <div
        className={`flex items-center justify-between p-3 hover:bg-[#165468] cursor-pointer transition-colors ${
          expanded ? 'bg-[#165468]' : ''
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center">
          <FaWarehouse className="mr-3" />
          <span>Warehouse</span>
        </div>
        {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
      </div>
      {expanded && (
        <ul className="bg-[#0a2e3b] py-1">
          {warehouseItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={submenuLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// Тогда в Sidebar будет просто:
<WarehouseMenu
  expanded={
    expandedMenus.warehouse || location.pathname.startsWith('/warehouse')
  }
  onToggle={() => toggleSubmenu('warehouse')}
  submenuLinkClass={submenuLinkClass}
/>;
