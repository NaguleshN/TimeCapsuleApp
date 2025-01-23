import { Container, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
          {/* <h1 className='text-center'>DigitalTimeCapsuleApp</h1> */}
          <br/>
          <br/>

        {userInfo ? (
          
          
          <div className='d-flex'>
            
            {/* hello */}
          </div>
          
          ):(
            <div className='d-flex'>
           
          </div>

            ) }
          
         
      </Container>
    </div>
  );
};

export default Hero;
