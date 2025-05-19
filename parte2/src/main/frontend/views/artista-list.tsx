import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ArtistaService, TaskService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Artista from 'Frontend/generated/org/unl/music/base/models/Artista';
import { useCallback, useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Artistas',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Artistas',
  },
};


type ArtistaEntryFormProps = {
  onArtistaCreated?: () => void;
};

type ArtistaEntryFormPropsUpdate = {
  artista: Artista;
  onArtistaUpdated?: () => void;
};
//GUARDAR ARTISTA
function ArtistaEntryForm(props: ArtistaEntryFormProps) {
  const nombre = useSignal('');
  const nacionalidad = useSignal('');
  const createArtista = async () => {
    try {
      if (nombre.value.trim().length > 0 && nacionalidad.value.trim().length > 0) {
        await ArtistaService.createArtista(nombre.value, nacionalidad.value);
        if (props.onArtistaCreated) {
          props.onArtistaCreated();
        }
        nombre.value = '';
        nacionalidad.value = '';
        dialogOpened.value = false;
        Notification.show('Artista creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };
  
  let pais = useSignal<string[]>([]);
  useEffect(() => {
    ArtistaService.listCountry().then(data =>
      pais.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);
  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo artista"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Candelar
            </Button>
            <Button onClick={createArtista} theme="primary">
              Registrar
            </Button>
            
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del artista" 
            placeholder="Ingrese el nombre del artista"
            aria-label="Nombre del artista"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Nacionalidad" 
            items={pais.value}
            placeholder='Seleccione un pais'
            aria-label='Seleccione un pais de la lista'
            value={nacionalidad.value}
            onValueChanged={(evt) => (nacionalidad.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button
            onClick={() => {
              dialogOpened.value = true;
            }}
          >
            Agregar
          </Button>
    </>
  );
}

const ArtistaEntryFormUpdate = function(props: ArtistaEntryFormPropsUpdate) {
  let pais = useSignal<string[]>([]);
  useEffect(() => {
    ArtistaService.listCountry().then(data =>
      pais.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);
  const nombre = useSignal(props.artista.nombres ?? '');
  const nacionidad = useSignal(props.artista.nacionidad ?? '');
  const createArtista = async () => {
    try {
      if (nombre.value.trim().length > 0 && nacionidad.value.trim().length > 0) {
        await ArtistaService.aupdateArtista(props.artista.id, nombre.value, nacionidad.value);
        if (props.onArtistaUpdated) {
          props.onArtistaUpdated();
        }
        nombre.value = '';
        nacionidad.value = '';
        dialogOpened.value = false;
        Notification.show('Artista actualizado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo actualizar, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar artista"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Cancelar
            </Button>
            <Button onClick={createArtista} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del artista" 
            placeholder="Ingrese el nombre del artista"
            aria-label="Nombre del artista"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Nacionalidad" 
            items={pais.value}
            placeholder='Seleccione un pais'
            aria-label='Seleccione un pais de la lista'
            value={nacionidad.value}
            onValueChanged={(evt) => (nacionidad.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button
        onClick={() => {
          dialogOpened.value = true;
        }}
      >
        Editar  
      </Button>
    </>
  );
};
;


//LISTA DE ARTISTAS
export default function ArtistaView() {
  
  const dataProvider = useDataProvider<Artista>({
    list: async () => {
      const result = await ArtistaService.listAll();
      return (result ?? []).filter((item): item is Artista => item !== undefined);
    },
  });

  function indexLink({ item }: { item: Artista }) {
    return (
      <span>
        <ArtistaEntryFormUpdate artista={item} onArtistaUpdated={dataProvider.refresh} />
      </span>
    );
  }

  return (

    <main className="w-full h-full flex flex-col box-border gap-s p-m">

      <ViewToolbar title="Lista de artista">
        <Group>
          <ArtistaEntryForm onArtistaCreated={dataProvider.refresh}/>
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn
          header="Nro"
          renderer={({ model }) => <span>{model.index + 1}</span>}
        />
        <GridColumn path="nombres" header="Nombre del artista" />
        <GridColumn path="nacionidad" header="Nacionidad">

        </GridColumn>
        <GridColumn header="Acciones" renderer={indexLink}/>
      </Grid>
    </main>
  );
}