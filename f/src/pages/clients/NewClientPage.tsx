import React from 'react';

const NewClientPage: React.FC = () => {
  return (
    <div>
      <h1>Add New Client</h1>
      <form>
        <div>
          <label>Name</label>
          <input type="text" name="name" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" />
        </div>
        <div>
          <label>Code</label>
          <input type="text" name="code" />
        </div>
        <div>
          <label>VAT Code</label>
          <input type="text" name="vat_code" />
        </div>
        <button type="submit">Create Client</button>
      </form>
    </div>
  );
};

export default NewClientPage;
