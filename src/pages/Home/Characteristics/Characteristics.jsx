import file from '../../../assets/icons/file.svg';
import microphone from '../../../assets/icons/microphone.svg';
import mobile from '../../../assets/icons/mobile.svg';
import support from '../../../assets/icons/support.svg';
import unlock from '../../../assets/icons/unlock.svg';
import video from '../../../assets/icons/video.svg';
import CharacteristicsCard from './CharacteristicsCard';

const Characteristics = () => {
    return (
        <div className='mx-auto w-11/12'>
            <div className='border-l-8 border-l-indigo-600 p-6 my-6 '>
                <h1 className='text-6xl font-bold italic'>
                    <span  className='text-2xl font-bold text-indigo-500'>MEMBERSHIPS <br /></span>
                     INCLUDE</h1>
                <h5 className='text-lg font-sans'>Phasellus non dolor nibh. Nullam elementum tellus pretium feugiat. Cras dictum tellus dui, vitae sollicitudin ipsum tincidunt in. Sed tincidunt tristique enim sed sollcitudin.</h5>
            </div>
            <div className='grid sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5 py-6'>
                <CharacteristicsCard bgclassName="bg-accent" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="Unlimited access" img={unlock}></CharacteristicsCard>
                <CharacteristicsCard bgclassName="bg-gradient-to-r from-cyan-500 to-blue-500" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="4500 video courses" img={video}></CharacteristicsCard>
                <CharacteristicsCard bgclassName="bg-accent" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="Expert teachers" img={microphone}></CharacteristicsCard>
                <CharacteristicsCard bgclassName="bg-accent" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="Valid Certification" img={file}></CharacteristicsCard>
                <CharacteristicsCard bgclassName="bg-gradient-to-r from-cyan-500 to-blue-500" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="On-the-go learning" img={mobile}></CharacteristicsCard>
                <CharacteristicsCard bgclassName="bg-accent" cardDetails="This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer." cardTitle="24x7 Super Support" img={support}></CharacteristicsCard>
            </div>
        </div>
    );
};

export default Characteristics;