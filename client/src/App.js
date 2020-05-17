import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { Formik, Form } from 'formik';

import featureService, { Base64 } from './services/feature.service';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '16px',
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function App() {
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState();

  const classes = useStyles();

  const insertFeatures = async (res) => {
    console.log(res);
    // TODO get feature do input passado pelo usuário
    let iFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            AGRAVO: 'DENGUE',
          },
          geometry: {
            type: 'Point',
            coordinates: [null, null],
            YZXDGBDNHIJAZFRGVSDWADUAWCDCYFXSFLHJDGDCIXSFTBQRQRMEPWLVTXWCFLZUAXJISVAPSVXULRPYVHBQKEXFJTHKWA: [
              'LTM4LjUzNzI2AVkLuVgFPIbBPwzuMTI=',
              'fLTMuNzcwMDQ5HpkFpqXOcekIbisMTI=',
            ],
          },
        },
      ],
    };

    let coordinates = '';
    for (let prop in iFeature.features[0].geometry) {
      if (prop !== 'type' && prop !== 'coordinates') coordinates = prop;
    }

    // get latitude e longitude
    iFeature.features = iFeature.features.map(function (value) {
      const lon = value.geometry[coordinates][0].substring(0, 16);
      const lat = value.geometry[coordinates][1].substring(1, 17);

      // console.log(parseFloat(Base64.decode(value.geometry[coordinates][1].substring(0, 16))));
      // console.log(parseFloat(Base64.decode(value.geometry[coordinates][1].substring(1, 17))));
      // console.log(parseFloat(Base64.decode(value.geometry[coordinates][1].substring(2, 18))));
      // console.log(parseFloat(Base64.decode(value.geometry[coordinates][1].substring(3, 19))));

      return {
        latitude: parseFloat(Base64.decode(lat)),
        longitude: parseFloat(Base64.decode(lon)),
      };
    });

    // get endemia do input
    iFeature.type = 'CHIKUNGUNYA';
    // get week do input
    const week = '29';
    const ano = '2019';
    const url = `http://tc1.sms.fortaleza.ce.gov.br/simda/chikungunya/mapaJSON?mapa=true&ano=${ano}&mes=&sem_pri=${ano}${week}&classifin=&criterio=&evolucao=&regional=&id_bairro=&id_unidade=&key=0&anomapa=`;
    const index = url.indexOf('sem_pri=');
    iFeature.year = url.substring(index + 8, index + 12);
    iFeature.week = url.substring(index + 12, index + 14);

    console.log(iFeature);
    console.log(url);

    if (res) {
      let res = await featureService.insertFeature(iFeature);
      setFeatures(iFeature);
      console.log(res);
      if (res.error) {
        console.log(res.message);
        toast.info('Document not found');
        setLoading(false);
      }
    }
  };

  return (
    <div className="container">
      <div className="box">
        <div className="form-group">
          <ToastContainer />
        </div>

        <div>
          <CssBaseline />
          {loading ? (
            <LinearProgress className="linear-progress" />
          ) : (
            <div className="linear-progress"></div>
          )}

          <Formik
            initialValues={{ endemia: '', ano: '', semana: '' }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                insertFeatures(values);
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting, handleBlur, handleChange }) => (
              <Form className={classes.root}>
                <TextField
                  label="endemia"
                  name="endemia"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                />

                <TextField
                  label="ano"
                  name="ano"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                />

                <TextField
                  label="semana"
                  name="semana"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                />
                <div>
                  <TextareaAutosize
                    aria-label="minimum height"
                    rowsMin={3}
                    rowsMax={20}
                    placeholder="Insira aqui o json"
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <pre>{JSON.stringify(features, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
