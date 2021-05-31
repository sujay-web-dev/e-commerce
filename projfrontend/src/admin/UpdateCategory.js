import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getCategory, updateCategory } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper/index";

function UpdateCategory({ match }) {
  const { user, token } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    loading: false,
    error: "",
    createdCategory: "",
    getaRedirect: false,
    formData: "",
  });

  const {
    name,
    // loading,
    error,
    createdCategory,
    // getaRedirect,
    formData,
  } = values;

  const preload = (categoryId) => {
    getCategory(categoryId).then((data) => {
      // console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          name: data.name,
          formData: new FormData(),
        });
      }
    });
  };

  useEffect(() => {
    preload(match.params.categoryId);
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    // console.log("Category ID --- ", match.params.categoryId);
    // console.log("formData --- ", formData);

    updateCategory(match.params.categoryId, user._id, token, formData).then(
      (data) => {
        if (data.error) {
          console.log(data.error);
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            loading: "false",
            createdCategory: data.name,
          });
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    console.log("before formData SET", name, value);
    // formData = new FormData();
    formData.set(name, value);
    console.log("formData --- ", formData);
    setValues({ ...values, [name]: value });
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: createdCategory ? "" : "none" }}
    >
      <h4>{createdCategory} Updated SuccessFully</h4>
    </div>
  );

  const errorMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: error ? "" : "none" }}
    >
      {console.log("Error-msg :", error)}
      <h4>Error Creating A Product</h4>
    </div>
  );

  const updateCategoryForm = () => (
    <form>
      <span>Post photo</span>

      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="name"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success mb-3"
      >
        Update Category
      </button>
    </form>
  );

  return (
    <Base
      title="Udapte a Product Here !"
      description="Welcome to Updating a Product"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3 rounded">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {updateCategoryForm()}
        </div>
        <input type="text" />
      </div>
    </Base>
  );
}

export default UpdateCategory;
