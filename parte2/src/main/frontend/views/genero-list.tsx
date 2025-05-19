import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {Button,ComboBox,Dialog,Grid,GridColumn,GridItemModel,TextField,VerticalLayout}
from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { GeneroService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import { useDataProvider } from '@vaadin/hilla-react-crud';
import Genero from 'Frontend/generated/org/unl/music/base/models/Genero';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Generos',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Genero',
  },
};

type GeneroEntryFormProps = {
  onGeneroCreated?: () => void;
};

function GeneroEntryForm(props: GeneroEntryFormProps) {
  const nombre = useSignal('');

  const dialogOpened = useSignal(false);

  const createGenero = async () => {
    try {
      if (
        nombre.value.trim().length > 0) {
        await GeneroService.createGenero(
          nombre.value
        );
        props.onGeneroCreated?.();
        nombre.value = '';
        dialogOpened.value = false;
        Notification.show('Genero creado', {
          duration: 5000,
          position: 'bottom-end',
          theme: 'success',
        });
      } else {
        Notification.show('No se pudo crear, faltan el nombre', {
          duration: 5000,
          position: 'top-center',
          theme: 'error',
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
        headerTitle="Nuevo Genero"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>
              Cancelar
            </Button>
            <Button onClick={createGenero} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem' }}>
          <TextField
            label="Nombre del Genero"
            placeholder="Ingrese el nombre del Genero"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => (dialogOpened.value = true)}>Agregar</Button>
    </>
  );
}
///////////////
export default function GeneroView() {
  const dataProvider = useDataProvider<Genero>({
    list: async () => (await GeneroService.listAll() ?? []).filter((g): g is Genero => g !== undefined),
  });
const generoEditando = useSignal<Genero | null>(null);
  const guardarCambios = async () => {
    const genero = generoEditando.value;
    if (!genero) return;

    try {
      if (
        (genero.nombre ?? '').trim().length > 0 ) {
        await GeneroService.updateGenero(
          genero.id,
          genero.nombre,
        );
        generoEditando.value = null;
        dataProvider.refresh();
        Notification.show('Genero actualizado', {
          duration: 5000,
          position: 'bottom-end',
          theme: 'success',
        });
      } else {
        Notification.show('Faltan datos para actualizar', {
          duration: 5000,
          position: 'top-center',
          theme: 'error',
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de generos">
        <Group>
          <GeneroEntryForm onGeneroCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>

      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn path="nombre" header="Nombre del genero" />
        <GridColumn
          header="Acciones"
          renderer={({ item }) => (
            <Button onClick={() => (generoEditando.value = { ...item })}>
              Actualizar
            </Button>
          )}
        />
      </Grid>

      <Dialog
        headerTitle="Editar genero"
        opened={!!generoEditando.value}
        onOpenedChanged={({ detail }) => {
          if (!detail.value) generoEditando.value = null;
        }}
        footer={
          <>
            <Button onClick={() => (generoEditando.value = null)}>
              Cancelar
            </Button>
            <Button onClick={guardarCambios} theme="primary">
              Guardar
            </Button>
          </>
        }
      >
        {generoEditando.value && (
          <VerticalLayout style={{ alignItems: 'stretch', width: '18rem' }}>
            <TextField
              label="Nombre del genero"
              value={generoEditando.value.nombre}
              onValueChanged={(evt) =>
                (generoEditando.value!.nombre = evt.detail.value)
              }
            />
          </VerticalLayout>
        )}
      </Dialog>
    </main>
  );
}

