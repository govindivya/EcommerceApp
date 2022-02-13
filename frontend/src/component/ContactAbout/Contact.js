import React, { Fragment } from 'react';
import './Contact.css'
function Contact(props) {
    return (
       <Fragment>
            <div className='contactPage'>
              <div className='leftContact'>
                  <form>
                    <input type="text"/>
                    <input type="email"/>
                    <textarea cols={20} rows={10}/>
                  </form>
              </div>
              <div className='rightContact'></div>
            </div>
       </Fragment>
    );
}

export default Contact;