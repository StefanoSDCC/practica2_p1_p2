package org.unl.music.base.controller;

import org.unl.music.base.controller.data_struct.list.LinkedList;

public class Practica {
    private Integer [] matriz;
    private LinkedList <Integer> lista;
    public void cargar() {
        //TODO
    }
    private Boolean verificar_numero_arreglo(Integer a) {
        int cont = 0;
        Boolean band = false;
        //StringBuilder resp = new StringBuilder();
        for(int i = 0; i < matriz.length; i++) {
            if(a.intValue() == matriz[i].intValue()) 
                cont++;
            if(cont>=2){
                band = true;
                break;
            }
        }
        return band;//resp.toString().split("-");
    }
    public String[] verificar_arreglo() {
        StringBuilder resp = new StringBuilder();
        for(int i = 0; i < matriz.length; i++) {
            if(verificar_numero_arreglo(matriz[i]))
                resp.append(matriz[i].toString()).append("-");
        }
        return resp.toString().split("-");
    }

    private Boolean verificar_numero_lista(Integer a) {
        int cont = 0;
        Boolean band = false;
        //StringBuilder resp = new StringBuilder();
        for(int i = 0; i < lista.getLength(); i++) {
            if(a.intValue() == lista.get(i).intValue()) 
                cont++;
            if(cont>=2){
                band = true;
                break;
            }
        }
        return band;//resp.toString().split("-");
    }
    public LinkedList<Integer> verificar_lista() {
        LinkedList<Integer> resp = new LinkedList<>();
        for(int i = 0; i < lista.getLength(); i++) {
            if(verificar_numero_lista(lista.get(i).intValue()))
                resp.add(lista.get(i));
        }
        return resp;
    }
}
