import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, NumberField, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ArtistaService, CancionServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Artista from 'Frontend/generated/org/unl/music/base/models/Artista';
import { useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Cancion',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Cancion',
  },
};

// Definir tipos para los items de los ComboBox
type ComboItem = {
  value: string;
  label: string;
};

type CancionData = {
  id: string;
  nombre: string;
  genero: string;
  id_genero: string;
  album: string;
  id_album: string;
  url: string;
  tipo: string;
  duracion?: string;
};

type CancionEntryFormProps = {
  onCancionCreated?: () => void;
};

function CancionEntryForm(props: CancionEntryFormProps) {
  const nombre = useSignal('');
  const generoId = useSignal(''); // Cambiado a generoId para claridad
  const albumId = useSignal(''); // Cambiado a albumId para claridad
  const duracion = useSignal('');
  const url = useSignal('');
  const tipo = useSignal('');
  
  const dialogOpened = useSignal(false);
  
  // Estados para los items de los ComboBox
  const [generosItems, setGenerosItems] = useState<ComboItem[]>([]);
  const [albumsItems, setAlbumsItems] = useState<ComboItem[]>([]);
  const [tiposItems, setTiposItems] = useState<string[]>([]);

  // Cargar los datos para los ComboBox cuando se monte el componente
  useEffect(() => {
    // Cargar géneros
    CancionServices.listaAlbumGenero().then(data => {
      if (data) {
        setGenerosItems(data as ComboItem[]);
      }
    }).catch(error => handleError(error));

    // Cargar álbumes
    CancionServices.listaAlbumCombo().then(data => {
      if (data) {
        setAlbumsItems(data as ComboItem[]);
      }
    }).catch(error => handleError(error));

    // Cargar tipos
    CancionServices.listTipo().then(data => {
      if (data) {
        setTiposItems((data ?? []).filter((item): item is string => typeof item === 'string'));
      }
    }).catch(error => handleError(error));
  }, []);

  const createCancion = async () => {
    try {
      if (
        nombre.value.trim().length > 0 && 
        generoId.value && 
        albumId.value && 
        duracion.value && 
        url.value.trim().length > 0 &&
        tipo.value
      ) {
        // Convertir los IDs a números
        const id_genero = parseInt(generoId.value);
        const id_album = parseInt(albumId.value);
        const duracionNum = parseInt(duracion.value);

        await CancionServices.create(
          nombre.value, 
          id_genero, 
          duracionNum, 
          url.value, 
          tipo.value, 
          id_album
        );
        
        if (props.onCancionCreated) {
          props.onCancionCreated();
        }
        
        // Limpiar formulario
        nombre.value = '';
        generoId.value = '';
        albumId.value = '';
        duracion.value = '';
        url.value = '';
        tipo.value = '';
        dialogOpened.value = false;
        
        Notification.show('Canción creada', { 
          duration: 5000, 
          position: 'bottom-end', 
          theme: 'success' 
        });
      } else {
        Notification.show('No se pudo crear, faltan datos', { 
          duration: 5000, 
          position: 'top-center', 
          theme: 'error' 
        });
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nueva Canción"
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
            <Button onClick={createCancion} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField 
            label="Nombre de la canción" 
            placeholder="Ingrese el nombre de la canción"
            aria-label="Nombre de la canción"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          
          <ComboBox 
            label="Género" 
            items={generosItems}
            itemLabelPath="label"
            itemValuePath="value"
            placeholder='Seleccione un género'
            aria-label='Seleccione un género de la lista'
            value={generoId.value}
            onValueChanged={(evt) => (generoId.value = evt.detail.value)}
          />
          
          <ComboBox 
            label="Álbum" 
            items={albumsItems}
            itemLabelPath="label"
            itemValuePath="value"
            placeholder='Seleccione un álbum'
            aria-label='Seleccione un álbum de la lista'
            value={albumId.value}
            onValueChanged={(evt) => (albumId.value = evt.detail.value)}
          />
          
          <ComboBox 
            label="Tipo" 
            items={tiposItems}
            placeholder='Seleccione un tipo de archivo'
            aria-label='Seleccione un tipo de archivo de la lista'
            value={tipo.value}
            onValueChanged={(evt) => (tipo.value = evt.detail.value)}
          />
          
          <NumberField  
            label="Duración"
            placeholder="Ingrese la duración de la canción (seg)"
            aria-label="Duración de la canción"
            value={duracion.value}
            onValueChanged={(evt) => (duracion.value = evt.detail.value)}
          />
          
          <TextField 
            label="Link de la canción" 
            placeholder="Ingrese el link de la canción"
            aria-label="Link de la canción"
            value={url.value}
            onValueChanged={(evt) => (url.value = evt.detail.value)}
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

// Componente para editar una canción
type CancionEntryFormUpdateProps = {
  cancion: CancionData;
  onCancionUpdated?: () => void;
};

function CancionEntryFormUpdate(props: CancionEntryFormUpdateProps) {
  const nombre = useSignal(props.cancion.nombre);
  const generoId = useSignal(props.cancion.id_genero);
  const albumId = useSignal(props.cancion.id_album);
  const duracion = useSignal('0'); // Necesitarías obtener la duración del backend
  const url = useSignal(props.cancion.url);
  const tipo = useSignal(props.cancion.tipo);
  
  const dialogOpened = useSignal(false);
  
  // Estados para los items de los ComboBox
  const [generosItems, setGenerosItems] = useState<ComboItem[]>([]);
  const [albumsItems, setAlbumsItems] = useState<ComboItem[]>([]);
  const [tiposItems, setTiposItems] = useState<string[]>([]);

  // Cargar los datos para los ComboBox cuando se monte el componente
  useEffect(() => {
    // Cargar géneros
    CancionServices.listaAlbumGenero().then(data => {
      if (data) {
        setGenerosItems(data as ComboItem[]);
      }
    }).catch(error => handleError(error));

    // Cargar álbumes
    CancionServices.listaAlbumCombo().then(data => {
      if (data) {
        setAlbumsItems(data as ComboItem[]);
      }
    }).catch(error => handleError(error));

    // Cargar tipos
    CancionServices.listTipo().then(data => {
      if (data) {
        setTiposItems((data ?? []).filter((item): item is string => typeof item === 'string'));
      }
    }).catch(error => handleError(error));
  }, []);

  const updateCancion = async () => {
    try {
      if (
        nombre.value.trim().length > 0 && 
        generoId.value && 
        albumId.value && 
        duracion.value && 
        url.value.trim().length > 0 &&
        tipo.value
      ) {
        // Convertir los IDs a números
        const id_genero = parseInt(generoId.value);
        const id_album = parseInt(albumId.value);
        const duracionNum = parseInt(duracion.value);
        const id = parseInt(props.cancion.id);

        await CancionServices.update(
          id,
          nombre.value, 
          id_genero, 
          duracionNum, 
          url.value, 
          tipo.value, 
          id_album
        );
        
        if (props.onCancionUpdated) {
          props.onCancionUpdated();
        }
        
        dialogOpened.value = false;
        
        Notification.show('Canción actualizada', { 
          duration: 5000, 
          position: 'bottom-end', 
          theme: 'success' 
        });
      } else {
        Notification.show('No se pudo actualizar, faltan datos', { 
          duration: 5000, 
          position: 'top-center', 
          theme: 'error' 
        });
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Canción"
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
            <Button onClick={updateCancion} theme="primary">
              Guardar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField 
            label="Nombre de la canción" 
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          
          <ComboBox 
            label="Género" 
            items={generosItems}
            itemLabelPath="label"
            itemValuePath="value"
            value={generoId.value}
            onValueChanged={(evt) => (generoId.value = evt.detail.value)}
          />
          
          <ComboBox 
            label="Álbum" 
            items={albumsItems}
            itemLabelPath="label"
            itemValuePath="value"
            value={albumId.value}
            onValueChanged={(evt) => (albumId.value = evt.detail.value)}
          />
          
          <ComboBox 
            label="Tipo" 
            items={tiposItems}
            value={tipo.value}
            onValueChanged={(evt) => (tipo.value = evt.detail.value)}
          />
          
          <NumberField  
            label="Duración"
            value={duracion.value}
            onValueChanged={(evt) => (duracion.value = evt.detail.value)}
          />
          
          <TextField 
            label="Link de la canción" 
            value={url.value}
            onValueChanged={(evt) => (url.value = evt.detail.value)}
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
}

// Vista principal de Canciones
export default function CancionView() {
  const dataProvider = useDataProvider({
    list: () => CancionServices.listCancion().then(result => result ?? []) 
  });

  function renderEditButton({ item }: { item: CancionData }) {
    return (
      <CancionEntryFormUpdate 
        cancion={item} 
        onCancionUpdated={dataProvider.refresh}
      />
    );
  }

  function renderIndex({ model }: { model: GridItemModel<CancionData> }) {
    return (
      <span>
        {model.index + 1} 
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Canciones">
        <Group>
          <CancionEntryForm onCancionCreated={dataProvider.refresh}/>
        </Group>
      </ViewToolbar>
      
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn renderer={renderIndex} header="Nro" />
        <GridColumn path="nombre" header="Canción" />
        <GridColumn path="genero" header="Género"/>
        <GridColumn path="album" header="Álbum"/>
        <GridColumn header="Acciones" renderer={renderEditButton}/>
      </Grid>
    </main>
  );
}