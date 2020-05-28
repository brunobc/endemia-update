import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    const { endemia, ano, semana, features } = res;
    console.log(features);
    console.log(typeof features);
    // TODO get feature do input passado pelo usuário
    // eslint-disable-next-line
    /*
    {
      "type":"FeatureCollection",
      "features": [
        {
          "type":"Feature",
          "properties":{
            "AGRAVO":"DENGUE"
          },
          "geometry":{
            "type":"Point",
            "coordinates":[
                null,
                null
            ],
            "HZTAUWTPDDFRWTVKXGDLZMELGBJTUVRDSTQFLOWUXGAGDBNHJRCROMHGTHCGODVFHIXDTCIYYFHV":[
                "LTM4LjQ2OTk3OVvfQtAtBXjEmBToMTI=",
                "ALTMuODE2MjY5Mg==kifYgpvKoYBMTY="
            ]
          }
        }
      ]
    }
    */
    let iFeature = {};

    let coordinates = '';
    for (let prop in features[0].geometry) {
      if (prop !== 'type' && prop !== 'coordinates') coordinates = prop;
    }

    // get latitude e longitude
    iFeature.features = features.map(function (value) {
      const lon = value.geometry[coordinates][1].substring(9, 25);
      const lat = value.geometry[coordinates][0].substring(10, 26);

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
    iFeature.type = endemia || 'DENGUE';
    // get week do input
    const week = String(semana).padStart(2, '0');
    const url = `http://tc1.sms.fortaleza.ce.gov.br/simda/chikungunya/mapaJSON?mapa=true&ano=${ano}&mes=&sem_pri=${ano}${week}&classifin=&criterio=&evolucao=&regional=&id_bairro=&id_unidade=&key=0&anomapa=`;
    const index = url.indexOf('sem_pri=');
    iFeature.year = url.substring(index + 8, index + 12) || '2020';
    iFeature.week = url.substring(index + 12, index + 14) || '01';

    console.log(iFeature);
    console.log(url);

    /*
    Enviar os dados para o backend e salvar no mongp
    let res = await featureService.insertFeature(iFeature);
    setFeatures(iFeature);
    console.log(res);
    if (res.error) {
      console.log(res.message);
      toast.info('Document not found');
      setLoading(false);
    }
    */
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
            initialValues={{ endemia: '', ano: '', semana: '', features: '' }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                insertFeatures({
                  ...values,
                  features: JSON.parse(values.data).features,
                });
                setSubmitting(false);
              }, 100);
            }}
          >
            {({ isSubmitting, handleBlur, handleChange, values }) => (
              <Form className={classes.root}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Endemia</InputLabel>
                  <Select
                    label="endemia"
                    name="endemia"
                    value={values.endemia}
                    onChange={handleChange}
                  >
                    <MenuItem value={'DENGUE'}>Dengue</MenuItem>
                    <MenuItem value={'CHIKUNGUNYA'}>Chikungunya</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel>Ano</InputLabel>
                  <Select
                    label="ano"
                    name="ano"
                    value={values.ano}
                    onChange={handleChange}
                  >
                    <MenuItem value={2016}>2016</MenuItem>
                    <MenuItem value={2017}>2017</MenuItem>
                    <MenuItem value={2018}>2018</MenuItem>
                    <MenuItem value={2019}>2019</MenuItem>
                    <MenuItem value={2020}>2020</MenuItem>
                    <MenuItem value={2021}>2021</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="semana"
                  name="semana"
                  type="number"
                  min={0}
                  onChange={handleChange}
                  value={values.semana}
                  inputProps={{ min: '0', max: '52', step: '1' }}
                  onBlur={handleBlur}
                  margin="normal"
                />
                <div style={{ width: '620px' }}>
                  <TextField
                    name="data"
                    value={values.data}
                    onChange={handleChange}
                    rows={10}
                    multiline
                    fullWidth
                    variant="filled"
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
