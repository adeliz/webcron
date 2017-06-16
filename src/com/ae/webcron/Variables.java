package com.ae.webcron;

import java.util.HashMap;
import java.util.Map;

public final class Variables {
	
	public final static Map<String, Object> map = new HashMap<>();
	
	public static Object get(String name) {
	    return map.get(name);
	}
	
	public static void set(String name, Object value) {
		map.put(name, value);
	}
    
}

/*
How to use it in the script parameter :

function fx(response){
    
    var Variables = Java.type('com.ae.webcron.Variables');

    Variables.set("test","Toto");
    
    return Variables.get("test");
}

*/