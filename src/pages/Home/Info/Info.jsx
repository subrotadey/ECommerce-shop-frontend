import clock from '../../../assets/icons/clock.svg';
import map from '../../../assets/icons/map.svg';
import phone from '../../../assets/icons/phone.svg';
import InfoCards from './InfoCards';

const Info = () => {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 py-6 -mt-20 mx-auto w-11/12'>
            <InfoCards bgclassName="bg-gradient-to-r from-cyan-500 to-blue-500" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="Opening Hours" img={clock}></InfoCards>
            <InfoCards bgclassName="bg-accent" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="Our Locations" img={map}></InfoCards>
            <InfoCards bgclassName="bg-gradient-to-r from-cyan-500 to-blue-500" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="Contact Us" img={phone}></InfoCards>
        </div>
    );
};

export default Info;