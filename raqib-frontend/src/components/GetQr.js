import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem } from '../actions/itemActions';
import { Button, Container, TextField, Typography } from '@mui/material';
import { S3 } from 'aws-sdk';
import JSZip from 'jszip';
function GetQr() {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [isOrderIdValid, setIsOrderIdValid] = useState(true);
  const [isProductIdValid, setIsProductIdValid] = useState(true);
  const isFormValid = orderId || (orderId && productId);
  const [zipFileName, setZipFileName] = useState(''); 
  const [downloadUrl, setDownloadUrl] = useState('');
  useEffect(() => {
    dispatch({ type: 'RESET'});
    setOrderId('');
    setProductId('');
  }, []); // Call reset when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDownloadClick();
  };

  const handleOrderIdChange = (e) => {
    const value = e.target.value.trim();
    setOrderId(value);
    setIsOrderIdValid(/^[a-zA-Z0-9]+$/.test(value));
  };

  const handleProductIdChange = (e) => {
    const value = e.target.value.trim();
    setProductId(value);
    setIsProductIdValid(/^[a-zA-Z0-9]+$/.test(value));
  };



  const handleDownloadClick = async () => {
    try {
      const s3 = new S3({
        region: 'us-east-1',
        accessKeyId: 'AKIAWV5UQCEI2G4G7ZFP',
        secretAccessKey: '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',
      });

      const bucketName = 'raqib-storage';
      const directoryPath = !productId ? orderId : [orderId, productId].join('/');
      const zipfile = (!productId ? orderId : [orderId, productId].join('-')) + ".zip";
      setZipFileName(zipfile);
      // Fetch S3 Objects
      const listObjectsResponse = await s3.listObjectsV2({
        Bucket: bucketName,
        Prefix: directoryPath,
      }).promise();
      console.log(listObjectsResponse);
      // Prepare File List
      const fileList = listObjectsResponse.Contents.map((object) => {
        const fileName = object.Key.replace(directoryPath, '');
        return { key: object.Key, name: fileName };
      });
      if(fileList.length == 0 ){
        alert(`No QR codes found for ${zipfile}`);
        return;
      }
      // Download File Contents
      const fileContents = await Promise.all(fileList.map(async (file) => {
        const object = await s3.getObject({ Bucket: bucketName, Key: file.key }).promise();
        return { name: file.name, content: object.Body };
      }));

      // Compress Files
      const zip = new JSZip();
      fileContents.forEach((item) => {
        zip.file(item.name, item.content);
      });
      const zippedContent = await zip.generateAsync({ type: 'blob' });

      // Provide Download Link
      const downloadLink = URL.createObjectURL(zippedContent);
      setDownloadUrl(downloadLink);
      setOrderId('');
      setProductId('');
    } catch (error) {
      console.log('Error occurred during S3 directory download:', error);
      alert(`Error occurred during download: ${error}`)
    }
  };

  return (
    <Container maxWidth="sm">
      <h2>Get QR Code </h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Order ID"
          variant="outlined"
          value={orderId}
          onChange={handleOrderIdChange}
          fullWidth
          margin="normal"
          required
          error={!isOrderIdValid}
          helperText={!isOrderIdValid && 'OrderId must be alphanumeric'}             
        />

        <TextField
          label="Product ID"
          variant="outlined"
          value={productId}
          onChange={handleProductIdChange}
          fullWidth
          margin="normal"
          error={!isProductIdValid}
          helperText={!isProductIdValid && 'ProductId must be alphanumeric'}           
        />
        <Button variant="contained" color="primary" type="submit" disabled={!isFormValid}>
          Download
        </Button>
      </form>
      <div>
      {downloadUrl && <a href={downloadUrl} download={zipFileName}>{zipFileName}</a>}
    </div>
    </Container>
  );
}

export default GetQr;
