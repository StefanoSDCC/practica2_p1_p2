package org.unl.music.base.controller.dao.dao_models;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Scanner;

import org.unl.music.base.controller.data_struct.list.LinkedList;

import com.google.gson.Gson;

public class AdapterDao <T> implements InterfaceDao<T> {
    private Class<T> clazz;
    private Gson g;
    protected static String base_path = "data"+File.separatorChar;
    public AdapterDao(Class<T> clazz) {
        this.clazz = clazz;
        this.g = new Gson();
    } 

    private String readFile() throws Exception {
        File file = new File(base_path+clazz.getSimpleName()+".json");
        if(!file.exists()) {            
            saveFile("[]");    
        }
        StringBuilder sb = new StringBuilder();
        try(Scanner in = new Scanner(new FileReader(file))) {
            while (in.hasNextLine()) {
                sb.append(in.nextLine()).append("\n");
            }
        }
        return sb.toString();
    }

    private void saveFile(String data) throws Exception {
        File file = new File(base_path+clazz.getSimpleName()+".json");
        //file.getParentFile().m
        if(!file.exists()) {
            System.out.println("Aqui estoy "+file.getAbsolutePath());
            file.createNewFile();
        }
        //if(!file.exists()) {
            FileWriter fw = new FileWriter(file);
            fw.write(data);
            fw.flush();
            fw.close();    
            //file.close();
        //}
    }

    @Override
    public LinkedList<T> listAll() {
        // TODO Auto-generated method stub
        //throw new UnsupportedOperationException("Unimplemented method 'listAll'");
        LinkedList<T> lista = new LinkedList<>();
        try {
            String data = readFile();
            T[] m = g.fromJson(data, (java.lang.reflect.Type) java.lang.reflect.Array.newInstance(clazz, 0).getClass());
            lista.toList(m);
            
        } catch (Exception e) {
            System.out.println("Error lista"+e.toString());
            // TODO: handle exception
        }
        return lista;
    }

    @Override
    public void persist(T obj) throws Exception {
        // TODO Auto-generated method stub
        //throw new UnsupportedOperationException("Unimplemented method 'persist'");
        LinkedList<T> list = listAll();
        System.out.println("lista lenrhg "+list.getLength());
        list.add(obj);
        saveFile(g.toJson(list.toArray()));
    }

    @Override
    public void update(T obj, Integer pos) throws Exception {
        LinkedList<T> list = listAll();
        list.update(obj, pos);
        saveFile(g.toJson(list.toArray()));
    }

    @Override
    public void update_by_id(T obj, Integer id) throws Exception {

    }

    @Override
    public T get(Integer id) throws Exception {
        LinkedList<T> list = listAll();
        return list.get(id);
    }
    
}
