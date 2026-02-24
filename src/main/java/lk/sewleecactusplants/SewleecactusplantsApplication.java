package lk.sewleecactusplants;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@SpringBootApplication
@RestController
public class SewleecactusplantsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SewleecactusplantsApplication.class, args);
		System.out.println("Spring Boot Succussfully Ran");
	}

	/*@RequestMapping(value = "/index")
	public String index () {
		return "<h1>Hello World</h1>";
	}*/

	@RequestMapping(value = {"/index", "/"})
	public ModelAndView loadIndexPageUI(){
		ModelAndView indexPageUI = new ModelAndView();
		indexPageUI.setViewName("index.html");
		return indexPageUI;
	}

	
	

}
