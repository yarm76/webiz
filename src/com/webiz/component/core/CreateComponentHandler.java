package com.webiz.component.core;

import java.util.Map;

public interface CreateComponentHandler {
	
	public boolean createModule(Map<String, Object> paramMap);
	
	public boolean createWidget(Map<String, Object> paramMap);
	
}
