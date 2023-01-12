import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { PreparedCategory } from './types/type';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const preparedCategories: PreparedCategory[] = categoriesFromServer
  .map(category => {
    const user = usersFromServer.find(u => u.id === category.ownerId);
    const products = productsFromServer.filter(
      (p) => category.id === p.categoryId,
    );

    return {
      ...category,
      user,
      products,
    };
  });

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [selectedCategoriId, setSelectedCategoriId] = useState(0);
  const [productSearch, setProductSearch] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setProductSearch(value);
  };

  const visibleProducts = productsFromServer.filter(product => {
    const title = product.name.toLowerCase();
    const editedtProductName = productSearch.toLowerCase().trim();

    return title.includes(editedtProductName);
  });

  const reset = () => {
    setProductSearch('');
  };

  function handleDelete() {
    reset();
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    data-cy="FilterUser"
                    href="#/"
                    key={user.id}
                    className={cn({ 'is-active': selectedUserId === user.id })}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={productSearch}
                  onChange={handleChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {productSearch
                  && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={handleDelete}
                      />
                    </span>
                  )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    data-cy="Category"
                    key={category.id}
                    className={cn('button mr-2 my-1', {
                      'is-info': selectedCategoriId === category.id,
                    })}
                    href="#/"
                    onClick={() => setSelectedCategoriId(category.id)}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >

            {visibleProducts.length !== 0 && (
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>
            )}
            <tbody>

              {visibleProducts.map(product => {
                return (
                  <>
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{ product.name}</td>

                      {preparedCategories.map(categor => {
                        return (
                          product.categoryId === selectedCategoriId && (
                            <>
                              <td data-cy="ProductCategory">{ `${categor.icon} - ${categor.title}`}</td>

                              <td
                                data-cy="ProductUser"
                                className={categor.user?.sex === 'm'
                                  ? 'has-text-link'
                                  : 'has-text-danger'}
                              >
                                {categor.user?.name}
                              </td>
                            </>
                          )
                        );
                      })}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
