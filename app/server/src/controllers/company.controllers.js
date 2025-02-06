import pinata from '../config/pinata.js';

export async function register(req, res) {
    try {
        const data = req.body;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const filename = `data-${Date.now()}.json`;
        const file = new File([blob], filename, { type: 'application/json' });
        
        const response = await pinata.upload.file(file);
        console.log(response);

        return res.status(200).json({message:'Success',data:response});
    } catch (error) {
        console.log(error)
        return res.status(500).json({messaga:'Failed' , error:error});   
    }
}

export async function signin(req , res) {
    try {
        const {cid} = req.params;
        const file = await pinata.gateways.get(cid);
        return res.status(200).json({message:'Success' , data:file.data});
    } catch (error) {
        console.log('Failed to get from ipfs\n',error);
        return res.status(500).json({message:'Failed'});
    }
}