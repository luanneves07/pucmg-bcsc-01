import React, { Component } from 'react';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      values: []
    }
  }

  componentWillMount() {
    let x = []
    this.props.products.forEach(p => {
      x[p.id] = window.web3.utils.fromWei(p.price.toString(), "ether")
    })
    this.setState({values: x})
  }

  render() {
    return (
      <div id="content">
        <h1>Adicionar Produto</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          this.props.createProduct(name, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Nome do produto"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Preço do produto (em Ether)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Adicionar produto</button>
        </form>
        <p>&nbsp;</p>
        <h2>Comprar produto</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Preço</th>
              <th scope="col">Proprietário</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products
              .filter(p => p.name !== "" && p.forSale || p.owner == this.props.account)
              .map((product, key) => {
              
                return (
                  <tr key={key}>
                    <th scope="row">{product.id.toString()}</th>
                    <td>{product.name}</td>
                    <td>{window.web3.utils.fromWei(product.price.toString(), "ether")} Eth</td>
                    <td>{product.owner}</td>
                    <td>
                      {!product.purchased
                        ? <button
                          name={product.id}
                          value={product.price}
                          onClick={(event) => {
                            this.props.purchaseProduct(event.target.name, event.target.value)
                          }}
                          >
                            Comprar
                          </button>
                        : null
                      }
                    </td>
                    <td>{product.owner == this.props.account ? 
                      <div>
                        <input 
                          value={this.state.values[product.id]}
                          onChange={(e) => {
                            const values = this.state.values;
                            values[product.id] = e.target.value
                            this.setState({values: values})
                            this.value = e.target.value;
                          }}
                        ></input>
                        <button
                          onClick={(event) => {
                            this.props.changePrice(product.id, this.state.values[product.id])
                          }}
                        >Alterar Preco</button>
                      </div>: null}
                    </td>
                    <td>
                      {
                        product.owner == this.props.account ?
                        product.forSale ?
                        <button
                          onClick={(event) => {
                            this.props.changeForSale(product.id, false)
                          }}
                        >Remover da venda</button>:
                        <button
                          onClick={(event) => {
                            this.props.changeForSale(product.id, true)
                          }}
                        >Colocar produto a venda</button>
                        : null
                      }
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
        <p><a href="https://ropsten.etherscan.io/address/0x781c71bfe45d1c5d81fca75d17bb589cc72d63fc" target="_blank">Informação do contrato</a></p>
      </div>
    );
  }
}

export default Main;
