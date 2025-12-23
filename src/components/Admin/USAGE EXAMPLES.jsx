// ============================================
// USAGE EXAMPLES
// ============================================

/*
// Button Usage
<Button variant="primary" size="sm" icon={Plus} onClick={handleClick}>
    Add Item
</Button>

// StatCard Usage
<StatCard
    label="Total Revenue"
    value="$125,430"
    change="+12.5%"
    icon={DollarSign}
    color="blue"
    trend="up"
/>

// Badge Usage
<Badge variant="success" size="sm">Active</Badge>

// Input Usage
<Input
    label="Email"
    type="email"
    icon={Mail}
    placeholder="Enter email"
    error="Invalid email"
/>

// Select Usage
<Select
    label="Status"
    options={[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ]}
/>

// Modal Usage
<Modal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    title="Add New Item"
    size="md"
    actions={
        <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
        </>
    }
>
    <p>Modal content here</p>
</Modal>

// Table Usage
<Table
    columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { 
            key: 'status', 
            label: 'Status',
            render: (value) => <Badge variant={value === 'active' ? 'success' : 'ghost'}>{value}</Badge>
        }
    ]}
    data={users}
    onRowClick={(row) => console.log(row)}
/>

// Pagination Usage
<Pagination
    currentPage={1}
    totalPages={10}
    totalItems={100}
    itemsPerPage={10}
    onPageChange={(page) => setCurrentPage(page)}
/>

// SearchBar Usage
<SearchBar
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search products..."
/>

// Toast Usage
<Toast
    message="Item saved successfully!"
    type="success"
    isVisible={showToast}
    onClose={() => setShowToast(false)}
/>

// EmptyState Usage
<EmptyState
    icon={Package}
    title="No products found"
    description="Get started by adding your first product"
    action={<Button variant="primary" icon={Plus}>Add Product</Button>}
/>
*/