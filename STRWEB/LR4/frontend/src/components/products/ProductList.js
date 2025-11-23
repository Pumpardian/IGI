import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Auth";
import { MessageContext } from "../Messages";
import Axios from "../../axios";

export default class ProductList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            searchQuery: ""
        };
    }

    componentDidMount() {
        const fetch = async () => {
            try {
                const response = await Axios.get("/api/products");
                this.setState({ products: response.data });
            } catch (err) {
                console.error("Error while receiving products: ", err.response?.data?.message);
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
            await Axios.delete(`/api/products/${id}`);
            this.setState(prevState => ({
                products: prevState.products.filter(product => product.id !== id)
            }));

            showMessage("Product deleted");
        } catch (err) {
            console.error("Error while deleting product: ", err.response?.data?.message);
            showMessage(err.response?.data?.message);
        }
    };

    formatTime = (dateString, options) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", options);
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
                {({ user, signIn, logOut, loading }) => (
                    <MessageContext.Consumer>
                        {({ showMessage }) => (
                        <>
                            <h1>Products</h1>

                            <div className="search">
                                <input
                                    type="text"
                                    placeholder="Type to search..."
                                    value={this.state.searchQuery}
                                    onChange={(e) => this.setState({ searchQuery: e.target.value })}
                                    onPaste={() => showMessage("Pasted!")}
                                    onCopy={() => showMessage("Copied!")}
                                />

                                {user && <Link to="/products/create" className="btn">Add</Link>}
                            </div>
                            
                            {filteredProducts.length === 0 ? (
                                <p>No products</p>
                            ) : (
                                <div className="product-list">
                                    {filteredProducts.map((product) => (
                                        <div className="card-wrapper" key={product.id}>
                                            <div className="product-card">
                                                {product.image && (
                                                    <img 
                                                        src={`http://localhost:8000${product.image.url}`}
                                                        alt={product.name}
                                                        className="product-image"
                                                    />
                                                )}
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
                                                                onDoubleClick={() => this.handleDelete(product.id, user, showMessage)} 
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
                            </>
                        )}
                    </MessageContext.Consumer>
                )}
            </AuthContext.Consumer>
        );
    }
}