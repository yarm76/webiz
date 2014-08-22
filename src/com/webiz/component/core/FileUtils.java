package com.webiz.component.core;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
/**
 * File IO
 * <p>
 * Title: File에서 특정 패턴의 string을 읽어서 다른 문자로 대치
 * </p>
 * <p>
 * Description:
 * </p>
 */
public class FileUtils {
	
	public static void replaceTextInFile(String[] args) {

		//	원본파일경로
		String fileName = "C:\\temp\\Log4j.properties";
		//file 객체 생성
		File inputFile = new File(fileName);
		File outputFile = new File(fileName+".temp");
		FileInputStream fileInputStream = null;
		BufferedReader bufferedReader = null;
		FileOutputStream fileOutputStream = null;
		BufferedWriter bufferedWriter = null;
		boolean result = false;
		try {
			//FileInputStream,FileOutputStream, BufferdReader, BufferedWriter
			// 생성
			fileInputStream = new FileInputStream(inputFile);
			fileOutputStream = new FileOutputStream(outputFile);
			bufferedReader = new BufferedReader(new InputStreamReader(
					fileInputStream));
			bufferedWriter = new BufferedWriter(new OutputStreamWriter(
					fileOutputStream));
					//원본 파일에서 읽어 들이는 한라인
					String line;
					// 패턴에 일치하는 문자로 대체하고 난 후의 string
					String repLine;
					//바꾸고자 하는 string과 바꿀 sting 정의
					String originalString = "%ASP_HOME%";
					String replaceString = "C:/ASP";
					//원본 파일에서 한라인씩 읽는다.
					while ((line = bufferedReader.readLine()) != null) {
						//일치하는 패턴에서는 바꿀 문자로 변환
						repLine = line.replaceAll(originalString, replaceString);
						// 새로운 파일에 쓴다.
						bufferedWriter.write(repLine, 0, repLine.length());
						bufferedWriter.newLine();
					}
					// 정상적으로 수행되었음을 알리는 flag
					result = true;
		} catch (IOException ex) {
			ex.printStackTrace();
		} finally {
			//리소스 해제. 개별적으로 해제한다.
			try {
				bufferedReader.close();
			} catch (IOException ex1) {
				ex1.printStackTrace();
			}
			try {
				bufferedWriter.close();
			} catch (IOException ex2) {
				ex2.printStackTrace();
			}
			//정상적으로 수행되었을 경우 원본 파일을 지우고 새로운 파일명을 원본파일명으로 rename한다.
			if (result) {
				inputFile.delete();
				outputFile.renameTo(new File(fileName));
			}
		}
	}
	
	public static void copy(File sourceF, File targetF){
		File[] ff = sourceF.listFiles();
		for (File file : ff) {
			File temp = new File(targetF.getAbsolutePath() + File.separator + file.getName());
			if(file.isDirectory()){
				temp.mkdir();
				copy(file, temp);
			} else {
				FileInputStream fis = null;
				FileOutputStream fos = null;
				try {
					fis = new FileInputStream(file);
					fos = new FileOutputStream(temp) ;
					byte[] b = new byte[4096];
					int cnt = 0;
					while((cnt=fis.read(b)) != -1){
						fos.write(b, 0, cnt);
					}
				} catch (Exception e) {
					e.printStackTrace();
				} finally{
					try {
						fis.close();
						fos.close();
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					
				}
			}
		}
	}
	
	
	public static String changeFileExtendion(String fileName){
		
		return fileName;
	}
}
	