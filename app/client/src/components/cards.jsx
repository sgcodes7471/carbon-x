import ethlogo from '../assets/eth.svg'

const Cards = ({ uname, eth, percent , handleBuy}) => {
  return (
    <div className="bg-[#4E4E4E] h-[120px] w-[20vw] rounded-lg flex flex-col justify-evenly items-center">
      {/* <div className="text-[22px] m-3"> </div> */}

      <div className="text-[1.5rem] font-bold"> {eth} Credits</div>
      <div className="flex w-full justify-around items-center">
        <div className="flex flex-col">
          {/* <div className="text-[1.2rem] font-bold"> {eth}</div> */}
          <div className="font-bold flex items-center gap-1"> 
            <img className='w-[40px] h-[40px]' src={ethlogo}/>
            <div className='flex flex-col'>
              <span className='text-[1.1rem]'>Total : {eth*percent}Gwei</span>
              <span className='text-[0.9rem] '>{percent}Gwei / credits</span>
            </div>
          </div>
        </div>
        <button className=" relative h-auto cursor-button m-0 border-[0px] border-[solid] 
        border-[rgb(187,204,0)] text-[15px] text-white px-[30px] py-[8px] [transition:300ms] w-[30%] 
        [box-shadow:rgba(14,_30,_37,_0.12)_0px_2px_4px_0px,_rgba(14,_30,_37,_0.32)_0px_2px_16px_0px] 
        rounded-[50px] bg-[rgb(204,_0,_0)] hover:text-[rgb(255,_255,_255)] hover:w-[30%] 
        hover:bg-[rgb(30,_30,_30)_none_repeat_scroll_0%_0%_/_auto_padding-box_border-box] "
        onClick={()=>{handleBuy(uname)}}>
        BUY
        </button>
      </div>
    </div>
  );
};

export default Cards;
