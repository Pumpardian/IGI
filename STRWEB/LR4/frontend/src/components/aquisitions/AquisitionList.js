import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";
import Axios from "../../axios";
import { AuthContext } from "../Auth";

export default class AquisitionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            aquisitions: [],
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
                const response = await Axios.get("/api/aquisitions");
                this.setState({ aquisitions: response.data });
            } catch (err) {
                console.error("Error while receiving aquisitions: ", err);
            }
        };

        fetch();
    }

    handleDelete = async (id) => {
        if (!this.user) {
            return;
        }

        try {
            await Axios.delete(`/api/aquisitions/${id}`);
            this.setState(prevState => ({
                aquisitions: prevState.aquisitions.filter(aquisition => aquisition.id !== id)
            }));
        } catch (err) {
            console.error("Error while deleting aquisition: ", err);
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
        return date.toLocaleTimeString("en-US", options);
    };

    getFilteredAquisitions() {
        return this.state.aquisitions.filter(aquisition =>
            Object.values(aquisition).some(value => 
                value && value.toString().toLowerCase().includes(this.state.searchQuery.toLowerCase())
            )
        );
    }

    getSortedAquisitions() {
        const filtered = this.getFilteredAquisitions();
        
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
        const sortedAquisitions = this.getSortedAquisitions();
        const filteredAquisitions = this.getFilteredAquisitions();

        return (
            <AuthContext.Consumer>
                {(user) => (
                    <div className="container">
                        <h1>Aquisitions</h1>

                        <div className="search">
                            <input
                                type="text"
                                placeholder="Type to search..."
                                value={this.state.searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                            />
                        </div>

                        {user && <Link to="/aquisitions/create">Add</Link>}
                        
                        {filteredAquisitions.length === 0 ? (
                            <p>No aquisitions</p>
                        ) : (
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
                                        <th onClick={() => this.handleSort("productID")}>
                                            Product ID
                                            {this.state.sortColumn === "productID" && (
                                                <span className="sort-icon">
                                                    {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </th>
                                        <th onClick={() => this.handleSort("supplierID")}>
                                            Supplier ID
                                            {this.state.sortColumn === "supplierID" && (
                                                <span className="sort-icon">
                                                    {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </th>
                                        <th onClick={() => this.handleSort("price")}>
                                            Price
                                            {this.state.sortColumn === "price" && (
                                                <span className="sort-icon">
                                                    {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </th>
                                        <th onClick={() => this.handleSort("count")}>
                                            Count
                                            {this.state.sortColumn === "count" && (
                                                <span className="sort-icon">
                                                    {this.state.sortDirection === "ascending" ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </th>
                                        <th onClick={() => this.handleSort("date")}>
                                            Date
                                            {this.state.sortColumn === "date" && (
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
                                    {sortedAquisitions.map(aquisition => (
                                        <tr key={aquisition.id}>
                                            <td>
                                                {aquisition.id}
                                            </td>
                                            <td>
                                                {aquisition.productID}
                                            </td>
                                            <td>
                                                {aquisition.supplierID}
                                            </td>
                                            <td>
                                                {aquisition.price}
                                            </td>
                                            <td>
                                                {aquisition.count}
                                            </td>
                                            <td title={this.formatTime(aquisition.date, { timeZone: "UTC" })}>
                                                {this.formatTime(aquisition.date)}
                                            </td>
                                            <td title={this.formatTime(aquisition.created_at, { timeZone: "UTC" })}>
                                                {this.formatTime(aquisition.created_at)}
                                            </td>
                                            <td title={this.formatTime(aquisition.updated_at, { timeZone: "UTC" })}>
                                                {this.formatTime(aquisition.updated_at)}
                                            </td>
                                            {user && (
                                                <td>
                                                    <Link to={`/aquisitions/${aquisition.id}/edit`} className="btn btn-secondary">
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => this.handleDelete(aquisition.id)} 
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
                        )}

                        <Outlet />
                    </div>
                )}
            </AuthContext.Consumer>
        );
    }
}