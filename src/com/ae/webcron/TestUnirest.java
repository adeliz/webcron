package com.ae.webcron;

import java.util.HashMap;
import java.util.Map;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

public class TestUnirest {

	public TestUnirest() {
		// TODO Auto-generated constructor stub
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		HttpResponse<String> stringResponse = null;
		try {
			stringResponse = Unirest.post("http://cmhm-sig/api/v1/sql/")
				.field("database","sig")
				.field("user","guest")
				.field("password","guest")
				.field("query","SELECT experimentation, count(*) as total FROM borehole  group by experimentation having count(*) > 40 order by experimentation")
				.asString();
			
			Map<String,Object> map = new HashMap<String,Object>();
			map.put("database","sig");
			map.put("user","guest");
			map.put("password","guest");
			map.put("query","SELECT experimentation, count(*) as total FROM borehole  group by experimentation having count(*) > 100 order by experimentation");
			
			stringResponse = Unirest.post("http://cmhm-sig/api/v1/sql/")
					.fields(map)
					.asString();
			
		} catch (UnirestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
