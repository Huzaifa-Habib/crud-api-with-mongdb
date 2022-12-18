import './App.css';
import { useState,useEffect } from 'react';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Navbar from 'react-bootstrap/Navbar';
import Spinner from 'react-bootstrap/Spinner';






let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}


function App() {

  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [show, setShow] = useState(false);
  const [editName,setEditName] =useState ("") 
  const [editPrice,setEditPrice] =useState ("") 
  const [editDesc,setEditDesc] =useState ("") 
  const [editId,setEditId] =useState (null) 
  const [searchId,setSearchId] =useState (null) 
  
  const [searchData,setSearchData] =useState ("") 
  const [show1, setShow1] = useState(false);

  const handleClose = () => setShow1(false);
  const [loadProduct, setLoadProduct] = useState(false)

  const [isSpinner, setIsSpinner] = useState(null)

  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"


    
  }



 

  

  











  





  





  const submitHandler =(event) =>{
    event.preventDefault()
    let productName = event.target.productName.value
    let productPrice = event.target.price.value
    let productDesc = event.target.description.value

    axios.post(`${baseUrl}/product`, {
      name: productName,
      price: productPrice,
      description:productDesc
    })
    .then((response) => {
      console.log(response);
      setData(response.data.data)

      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        setLoadProduct(!loadProduct)


    }, 3000);
    }, (error) => {
      console.log(error);
    });


      



  }



  const allProductsHandler=()=>{
    axios.get(`${baseUrl}/products`)
    .then((response) => {
      console.log(response);
      setAllData(response.data.data)
 
    }, (error) => {
      console.log(error);
    });

 


  }


  const deleteProductHandler = (ids) =>{
    console.log(ids)
    axios.delete(`${baseUrl}/product/${ids}`)
    .then(response => {
      console.log("response: ", response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        setLoadProduct(!loadProduct)
    }, 2000);


      
     

    })

    .catch(err => {
        console.log("error: ", err);
    })

  }

  const handleData = async (id,names,price,desc) =>{
    setShow(true)
    setLoadProduct(!loadProduct)


    // setEditId(id)
    // setEditName(names)
    // setEditPrice(price)
    // setEditDesc(desc)

    // console.log(editId)
    // console.log(editName)


  }

  const updateProductHandler = (event) =>{
    setShow(false)
    event.preventDefault()
    let productName = event.target.product.value
    let productPrice = event.target.price.value
    let productDesc = event.target.description.value


      axios.put(`${baseUrl}/product/${editId}`,{
      name:productName ,
      price: productPrice  ,
      description: productDesc

    })
    .then((response) => {
      console.log(response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        setLoadProduct(!loadProduct)

    }, 3000);
     
    }, (error) => {
      console.log(error);
    });

    
  



  }

  const getProductHandlerOnId = () =>{
    setShow1(true)
    axios.get(`${baseUrl}/product/${searchId}`)
    .then((response) => {
      console.log(response);
      setSearchData(response.data.data)


     
    }, (error) => {
      console.log(error);
    });

  }

  useEffect(() => {

    allProductsHandler()
  }, [loadProduct])

  let emptyError = document.querySelector(".emptyError")
  let lengthError = document.querySelector(".lengthError")
  let descEmptyError = document.querySelector(".descEmptyError")
  let descError = document.querySelector(".descLengthError")

  const nameHandler = (e) =>{
    if (e.target.value == "") {
      emptyError.style.display = "block"
      lengthError.style.display = "none"

    }

    else{
      emptyError.style.display = "none"
      lengthError.style.display = "none"



    }

  }

  const nameError = (e) =>{
    if (e.target.value.length < 3) {
      lengthError.style.display = "block"
      emptyError.style.display = "none"

    }

    else{
      lengthError.style.display = "none"
      emptyError.style.display = "none"



    }

  }




  const descHandler = (e) =>{
    if (e.target.value == "") {
      descEmptyError.style.display = "block"
      descError.style.display = "none"

    }

    else{
      descEmptyError.style.display = "none"
      descError.style.display = "none"



    }

  }

  const descLengthError = (e) =>{
    if (e.target.value.length < 3) {
      descError.style.display = "block"
      descEmptyError.style.display = "none"

    }

    else{
      descEmptyError.style.display = "none"
      descError.style.display = "none"



    }

  }


  

  



  return (
    <div className='main-div'>
      <div className='spinner-div'>
        <div className='spinner'>
        <Spinner animation="grow" variant="danger" />
        </div>
      </div>
      <div className='nav-div' >
          <Navbar bg="dark" expand="lg">
            <Container fluid className='nav' >
              <Navbar.Brand className='nav-a'>Product App</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: '100px' }}
                  navbarScroll
                >
                
                </Nav>
                <Form className="d-flex">
                     <Form.Control
                        type="text"
                        placeholder='Enter Product Id'
                        className="me-2"
                        aria-label="Search"

                        onChange={(e) =>{
                          setSearchId(e.target.value)
                          }}
                    />
      

                    <Button variant="outline-success" onClick={getProductHandlerOnId} className="search-btn" >Search</Button>
                </Form>


              </Navbar.Collapse>
            </Container>
        </Navbar>
        


      </div>
  

  
   
     

      <div className='input-div'>
        <form onSubmit={submitHandler}>
          <input type="text" name="productName" id="name" placeholder='Enter Product Name ' required onBlur={nameHandler} onChange={nameError}  /> <br />
          <span className='emptyError'>Don't leave field empty!</span>
          <span className='lengthError'>Your Value should be greater than two characters</span>


          <input type="number" name="price" id="price" placeholder='Enter Product Price' required  /> <br />

          <textarea name="description" id="" cols="80" rows="5" placeholder='Enter Product Description...' required maxLength={500} onBlur={descHandler} onChange={descLengthError}></textarea>
          <span className='descEmptyError'>Don't leave field empty!</span>
          <span className='descLengthError'>Your Value should be greater than two characters</span>

          <Button variant="outline-success" type='submit' className='btn' >Add Product</Button>


        </form>
      </div>

      <div className='display-div' id='display'>



        {

              (allData.length !== 0)?
                  <div className='table'>

                  
                    <Table responsive="xl"  striped bordered hover variant="dark"  >
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Product Price</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                     { allData.map((eachData,i) => (  
                      
                     <tbody key={i}>
                        <tr>
                          <td>{eachData?.name}</td>
                          <td>Rs.{eachData?.price}</td>
                          <td>{eachData?.description} <br />
                          <button onClick={()=>{
                            deleteProductHandler(eachData?._id)

                          }}>Delete</button>

                          <button onClick={()=>{
                          handleData(
                            setEditId(eachData?._id),
                            setEditName(eachData?.name),
                            setEditPrice(eachData?.price),
                            setEditDesc(eachData?.description)
                        )

                          }}>Update</button>



                          </td>
                        </tr>


                        
                     
                      </tbody>
                      ))}

                    
                    </Table>


                  </div>
              

                :
                null
          
                    

        

              
        }


      

        <div className='modal-div'>
          <Modal
            show={show}
            backdrop="static"
            keyboard={false}
          >
          <Modal.Header>
            <Modal.Title>Update Your Product</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={updateProductHandler} className = "updateForm" >
              <label>Product Name:</label>
                <input type="text" defaultValue = {editName} name = "product"
              
                />
                <br />
                <label>Product Price:</label>
                <input type="text" defaultValue = {editPrice} name = "price"
                  
                />
                <br />
                <label>Description:</label>

                <textarea name="description" id="" cols="80" rows="5" defaultValue={editDesc} 
                 
                ></textarea>
              <Button variant="primary" type='submit' className='updateBtn'>Save Changes</Button>

            </form>


           
          </Modal.Body>

          <Modal.Footer>

          </Modal.Footer>
        </Modal>

        </div>

      </div>


      <div className='onSearchData'>
        
          <Modal
            show={show1}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Your Data of id: {searchData?.id} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
             
             <p>Name: {searchData?.name}</p>
             <p>Price: {searchData?.price}</p>
             <p>Description: {searchData?.description}</p>

             

            
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Ok.
              </Button>
            </Modal.Footer>
          </Modal>

      </div>

     




      

    </div>
    
  );
}

export default App;
