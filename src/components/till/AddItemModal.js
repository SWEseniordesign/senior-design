import { useHookstate } from "@hookstate/core";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState, useRef } from "react";
import { COLOR_PALETTE } from "../../Constants";
import { createItem } from "../../requests/items-req";
import { itemState } from "../../states/itemState";
import MtButton from "../mui/MTButton";
import { MTModal } from "../mui/MTModal";
import MTTextField from "../mui/MTTextField";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ReactCrop, {centerCrop, makeAspectCrop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const useStyle = makeStyles({
    paper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'fit-content',
        minWidth: '20%',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '24px'
    }
})

//* The modal that pops up when the user wants to add a item.
export const AddItemModal = (props) => {

    const {items, card} = props;

    const localItemState = useHookstate(itemState);

    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
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

    const onSelectFile = (e) => {
        console.log('onSelectFile');
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined)
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                let result = reader.result?.toString();
                console.log('result', result);
                setImgSrc(result);
            })
            reader.readAsDataURL(e.target.files[0])
            setImgName(e.target.files[0].name);
        }
    }

    const onImageLoad = (e) => {
        console.log('onImageLoad')
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

    const onUploadClick = (e) => {
        console.log('onUploadClick');
        inputFileRef.current.click();
    }

    const handleAddItem = async (e) => {
        setLoading(true);
        
        let addResponse = await createItem(
            {
                cardId: card.id, 
                name: newItemName, 
                price: newItemPrice,
                image: '',
                props: [],
                stock: 1
            }
        );

        if(addResponse.code === 201){
            items.push({id: items.length !== 0 ? items[items.length-1].id + 1 : 0, name: newItemName, price: newItemPrice})
            setSaveMessage("Item Created!");
        } else {
            setSaveMessage("Error creating the item");
        }
        setLoading(false);

        let timeout = setTimeout(() => {
            localItemState.isAdd.set(false);
        }, 2000)

        return () => clearTimeout(timeout);

    }

    const handleCloseModal = () => {
        localItemState.isAdd.set(false);
    }

    const classes = useStyle();

    return (
        <MTModal
            open={localItemState.isAdd.get()}
            handleOnClose={handleCloseModal}
        >
            <Paper className={classes.paper} sx={{ bgcolor: COLOR_PALETTE.BABY_BLUE }}>
                    <Typography variant="h5">Add Item to {localItemState.card.get().name}</Typography>
                    <MTTextField label={'Name'} value={newItemName} onChangeFunc={setNewItemName}/>
                    <MTTextField label={'Price'} value={newItemPrice} onChangeFunc={setNewItemPrice} icon={'$'}/>
                    <MtButton label={'UPLOAD IMAGE'} startIcon={<FileUploadIcon/>} variant={'outlined'} onClick={() => onUploadClick()} width={'64%'} />
                    <input hidden type="file" id="upload" ref={inputFileRef} accept="image/*" onChange={onSelectFile} />
                    <Typography variant="subtitle2">{imgName}</Typography>
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
                    {/* {!!completedCrop && (
                        <>
                        <div>
                            <canvas
                            ref={previewCanvasRef}
                            style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                width: completedCrop.width,
                                height: completedCrop.height,
                            }}
                            />
                        </div>
                        </>
                    )} */}
                    <MtButton label={'ADD'} variant={'contained'} onClick={() => handleAddItem()} width={'64%'} loading={loading} isLoadingButton />
                    {saveMessage !== '' && <Typography variant="subtitle2">{saveMessage}</Typography>}
            </Paper>
        </MTModal>
    )
}