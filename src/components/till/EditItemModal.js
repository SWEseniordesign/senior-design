import { useHookstate } from "@hookstate/core";
import { Paper, Typography, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState, useRef, useEffect } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { itemState } from "../../states/itemState";
import MtButton from "../mui/MTButton";
import { MTModal } from "../mui/MTModal";
import MTTextField from "../mui/MTTextField";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { updateItem } from "../../requests/items-req";
import ReactCrop, {centerCrop, makeAspectCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const useStyle = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'fit-content',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
    },
    group: {
        display: 'flex',
        gap: '12px',
    }
})

//* The modal that pops up when the user wants to edit a tab.
export const EditItemModal = (props) => {
    const {item, card} = props;

    const localItemState = useHookstate(itemState);

    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemStock, setNewItemStock] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const [imgSrc, setImgSrc] = useState('');
    const [imgName, setImgName] = useState('');
    const [crop, setCrop] = useState({});
    const [completedCrop, setCompletedCrop] = useState('');

    const inputFileRef = useRef(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const aspect = 16/9;

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return
        }

        const image = imgRef.current
        const canvas = previewCanvasRef.current
        const crop = completedCrop

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext('2d')

        canvas.width = crop.width
        canvas.height = crop.height

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        )
    }, [imgSrc, completedCrop]);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined)
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                //TODO: Check Image Size Constraints, Make Toast if bad image
                if(e.target.files[0].size > 100000){
                    alert('Image is too large. Please choose a smaller image.');
                    return;
                }
                let result = reader.result?.toString();
                setImgSrc(result);
                setImgName(e.target.files[0].name);
            })
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget
        setCrop(
            centerCrop(
                makeAspectCrop(
                  {
                    unit: '%',
                    width: 90,
                  },
                  aspect,
                  width,
                  height,
                ),
                width,
                height,
            )
        )
    }

    const onUploadButtonClick = (e) => {
        inputFileRef.current.click();
    }

    const clearSrc = () => {
        setImgSrc('');
        setImgName('');
        setCompletedCrop('');
    }

    const getBase64FromCanvas = async (canvas) => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return '';
        }
        let base64 = canvas.toDataURL('image/jpeg');
        if(!base64){
            return '';
        }
        return base64;
    }

    const handleEditItem = async (e) => {
        setLoading(true);

        let newItemImage = await getBase64FromCanvas(previewCanvasRef.current);

        let updatedItem = {
            id: item.id,
            name: newItemName,
            price: newItemPrice,
            image: newItemImage,
            props: [],
            stock: newItemStock
        }     

        let editResponse = await updateItem(updatedItem);

        if(editResponse.updated){
            card.items = card.items.map((cItem) => {
                if(item.id === cItem.id){
                    return updatedItem;
                }
                return cItem;
            })

            setSaveMessage("Item Saved!");
        } else {
            setSaveMessage("Error saving the item");
        }
        setLoading(false);

        let timeout = setTimeout(() => {
            if(editResponse.updated) localItemState.isEdit.set(false);
        }, 2000)

        return () => clearTimeout(timeout);

    }

    const handleCloseModal = () => {
        localItemState.isEdit.set(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={localItemState.isEdit.get()}
            handleOnClose={() => handleCloseModal()}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5" sx={{overflow: 'hidden', whiteSpace: 'nowrap'}}>Editing Item: {localItemState.item.get().name}</Typography>
                    <MTTextField label={'New Name'} value={newItemName} onChangeFunc={setNewItemName} isFullWidth />
                    <div className={classes.group}>
                        <MTTextField label={'New Price'} value={newItemPrice} onChangeFunc={setNewItemPrice}/>
                        <MTTextField label={'New Stock'} value={newItemStock} onChangeFunc={setNewItemStock}/>
                    </div>
                    <MtButton label={'CHANGE IMAGE'} startIcon={<FileUploadIcon/>} variant={'outlined'} onClick={() => onUploadButtonClick()} width={'64%'} />
                    <input hidden type="file" id="upload" ref={inputFileRef} accept="image/*" onChange={onSelectFile} />
                    <Typography variant="subtitle2">{imgName} 
                        {imgName? 
                            <Link mr={1} ml={1} underline="always" onClick={clearSrc}>Cancel</Link> 
                        : null}
                    </Typography>
                    {!!imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                        >
                            <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    )}
                    {!!completedCrop && (
                        <>
                        <div>
                            <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                width: 256,
                                height: 144,
                            }}
                            />
                        </div>
                        </>
                    )}
                    <MtButton label={'SAVE'} variant={'contained'} onClick={() => handleEditItem()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}