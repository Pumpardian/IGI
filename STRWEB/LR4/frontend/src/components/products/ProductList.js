import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../Auth";
import Axios from "../../axios";

export default class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            searchQuery: ""
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        const fetch = async () => {
            try {
                const response = await Axios.get("/api/products");
                this.setState({ products: response.data });
            } catch (err) {
                console.error("Error while receiving products: ", err);
            }
        };

        fetch();
    }

    handleDelete = async (id) => {
        if (!this.user) {
            return;
        }

        try {
            await Axios.delete(`/api/products/${id}`);
            this.setState(prevState => ({
                products: prevState.products.filter(product => product.id !== id)
            }));
        } catch (err) {
            console.error("Error while deleting product: ", err);
        }
    };

    formatTime = (dateString, options) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", options);
    };

    getFilteredProducts() {
        return this.state.products.filter(product =>
            Object.values(product).some(value => 
                value && value.toString().toLowerCase().includes(this.state.searchQuery.toLowerCase())
            )
        );
    }

    render() {
        const filteredProducts = this.getFilteredProducts();

        return (
            <AuthContext.Consumer>
                {(user) => (
                    <div className="container">
                        <h1>Products</h1>

                        <div className="search">
                            <input
                                type="text"
                                placeholder="Type to search..."
                                value={this.state.searchQuery}
                                onChange={(e) => this.setState({ searchQuery: e.target.value })}
                            />
                        </div>

                        {user && <Link to="/products/create">Add</Link>}
                        
                        {filteredProducts.length === 0 ? (
                            <p>No products</p>
                        ) : (
                            <div className="product-list">
                                {filteredProducts.map((product) => (
                                    <div className="card-wrapper" key={product.id}>
                                        <div className="product-card">
                                            <h3 className="product-title">
                                                {product.title}
                                            </h3>
                                            <p className="product-description">
                                                {product.description}
                                            </p>
                                            <p className="product-price">
                                                {product.price}
                                            </p>
                                            <p title={this.formatTime(product.createdAt, { timeZone: "UTC" })} className="product-description">
                                                {`Created: ${this.formatTime(product.createdAt)}`}
                                            </p>
                                            <p title={this.formatTime(product.updatedAt, { timeZone: "UTC" })} className="product-description">
                                                {`Updated: ${this.formatTime(product.updatedAt)}`}
                                            </p>
                                            <div className="container">
                                                <Link to={`/products/${product.id}`} className="btn btn-primary">
                                                    View
                                                </Link>

                                                {user && (
                                                    <>
                                                        <Link to={`/products/${product.id}/edit`} className="btn btn-secondary">
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => this.handleDelete(product.id)} 
                                                            className="btn btn-danger"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </AuthContext.Consumer>
        );
    }
}