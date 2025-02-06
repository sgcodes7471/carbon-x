import cross from '../assets/cross.svg'

const Dialog = ({msg,closefn,callback})=>{
    return(
        <>
        <div className='w-[100%] h-[100%] top-0 fixed z-[50] glassmorphism'></div>
        <div className='w-[100%] h-[100%] fixed top-0 flex justify-center items-center z-[100]'>
            <div className='w-[400px] min-h-[250px] bg-[#191a1a] relative p-8 rounded-3xl shadow-xl
            text-wrap flex justify-around flex-col items-center'>
                <img src={cross} alt="x" onClick={()=>{closefn(false)}} 
                className='absolute w-[30px] top-[-10px] right-[10px] cursor-pointer'/>
                <div className='text-[25px] text-center font-semibold'>{msg}</div>
                {
                    callback &&
                    <button className='relative text-center h-auto cursor-button m-0 border-[0px] border-[solid] 
                    border-[rgb(187,204,0)] text-[18px] font-bold text-white px-[20px] py-[8px] [transition:300ms] 
                    [box-shadow:rgba(14,_30,_37,_0.12)_0px_2px_4px_0px,_rgba(14,_30,_37,_0.32)_0px_2px_16px_0px]'
                    onClick={callback}>
                    Proceed</button>
                }
            </div>
        </div>
        </>
    )
}

export default Dialog