import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth";
import { MessageContext } from "../Messages";
import Axios from "../../axios";

export default class SupplierList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            suppliers: [],
            searchQuery: "",
            sortColumn: "",
            sortDirection: "ascending"
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    componentDidMount() {
        const fetch = async () => {
            try {
                const response = await Axios.get("/api/suppliers");
                this.setState({ suppliers: response.data });
            } catch (err) {
                console.error("Error while receiving suppliers: ", err.response?.data?.message);
            }
        };

        fetch();
    }

    handleDelete = async (id, user, showMessage) => {
        if (!user) {
            console.log("User not authenticated");
            return;
        }

        try {
            await Axios.delete(`/api/suppliers/${id}`);
            this.setState(prevState => ({
                suppliers: prevState.suppliers.filter(supplier => supplier.id !== id)
            }));

            showMessage("Supplier deleted");
        } catch (err) {
            console.error("Error while deleting supplier: ", err.response?.data?.message);
            showMessage(err.response?.data?.message);
        }
    };

    handleSort = (column) => {
        if (this.state.sortColumn === column) {
            this.setState(prevState => ({ 
                sortDirection: prevState.sortDirection === "ascending" ? "descending" : "ascending" 
            }));
        } else {
            this.setState({ 
                sortDirection: "ascending", 
                sortColumn: column 
            });
        }
    };

    formatTime = (dateString, options) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", options);
    };

    getFilteredSuppliers() {
        return this.state.suppliers.filter(supplier =>
            Object.values(supplier).some(value => 
                value && value.toString().toLowerCase().includes(this.state.searchQuery.toLowerCase())
            )
        );
    }

    getSortedSuppliers() {
        const filtered = this.getFilteredSuppliers();
        
        if (!this.state.sortColumn) {
            return filtered;
        }

        return [...filtered].sort((a, b) => {
            const aValue = a[this.state.sortColumn];
            const bValue = b[this.state.sortColumn];

            if (aValue < bValue) {
                return this.state.sortDirection === "ascending" ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.state.sortDirection === "ascending" ? 1 : -1;
            }
            return 0;
        });
    }

    render() {
        const sortedSuppliers = this.getSortedSuppliers();
        const filteredSuppliers = this.getFilteredSuppliers();

        return (
            <AuthContext.Consumer>
                {({ user, signIn, logOut, loading }) => (
                    <MessageContext.Consumer>
                        {({ showMessage }) => (
                            <>
                                <h1>Suppliers</h1>

                                <div className="search">
                                    <input
                                        type="text"
                                        placeholder="Type to search..."
                                        value={this.state.searchQuery}
                                        onChange={(e) => this.setState({ searchQuery: e.target.value })}
                                        onPaste={() => showMessage("Pasted!")}
                                        onCopy={() => showMessage("Copied!")}
                                    />

                                    {user && <Link to="/suppliers/create" className="btn">Add</Link>}
                                </div>
                                
                                {filteredSuppliers.length === 0 ? (
                                    <p>No suppliers</p>
                                ) : (
                                    <div className="table-container">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th onClick={() => this.handleSort("id")}>
                                                        ID
                                                        {this.state.sortColumn === "id" && (
                                                            <span className="sort-icon">
                                                                {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                            </span>
                                                        )}
                                                    </th>
                                                    <th onClick={() => this.handleSort("name")}>
                                                        Name
                                                        {this.state.sortColumn === "name" && (
                                                            <span className="sort-icon">
                                                                {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                            </span>
                                                        )}
                                                    </th>
                                                    <th onClick={() => this.handleSort("phone")}>
                                                        Phone
                                                        {this.state.sortColumn === "phone" && (
                                                            <span className="sort-icon">
                                                                {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                            </span>
                                                        )}
                                                    </th>
                                                    <th onClick={() => this.handleSort("address")}>
                                                        Address
                                                        {this.state.sortColumn === "address" && (
                                                            <span className="sort-icon">
                                                                {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                            </span>
                                                        )}
                                                    </th>
                                                    <th>Created</th>
                                                    <th>Updated</th>
                                                    {user && <th>Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedSuppliers.map((supplier) => (
                                                    <tr key={supplier.id}>
                                                        <td>{supplier.id}</td>
                                                        <td>{supplier.name}</td>
                                                        <td>{supplier.phone}</td>
                                                        <td>{supplier.address}</td>
                                                        <td title={this.formatTime(supplier.createdAt, { timeZone: "UTC" })}>
                                                            {this.formatTime(supplier.createdAt)}
                                                        </td>
                                                        <td title={this.formatTime(supplier.updatedAt, { timeZone: "UTC" })}>
                                                            {this.formatTime(supplier.updatedAt)}
                                                        </td>
                                                        {user && (
                                                            <td>
                                                                <Link to={`/suppliers/${supplier.id}/edit`} className="btn btn-secondary">
                                                                    Edit
                                                                </Link>
                                                                <button 
                                                                    onDoubleClick={() => this.handleDelete(supplier.id, user, showMessage)} 
                                                                    className="btn btn-danger"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </MessageContext.Consumer>
                )}
            </AuthContext.Consumer>
        );
    }
}