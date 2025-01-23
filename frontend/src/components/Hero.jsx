import { Container, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
          <h1 className='text-center'>DigitalTimeCapsuleApp</h1>
          <br/>
          <br/>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>

        {userInfo ? (
          
          
          <div className='d-flex'>
            
            hello
          </div>
          
          ):(
            <div className='d-flex'>
            <Button variant='primary' href='/login' className='me-3'>
              Sign In
            </Button>
            <Button variant='secondary' href='/register'>
              Register
            </Button>
          </div>

            ) }
          
         
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
