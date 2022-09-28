import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFilesService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  successMessage = '';
  errorMessage = '';
  MAX_SIZE: number = 1048576;   // Maximum file size allowed to be uploaded = 1MB

  fileInfos?: Observable<any>;

  image: string = ""
  constructor(private uploadService: UploadFilesService) { }

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  /* upload the selected File */
  upload(){
    this.progress = 0;

    if (this.selectedFiles) {
      //select only one file in case of multi file upload attempt
      const file: File | null = this.selectedFiles.item(0);

      /* check inputed file for validity */
      if (file &&                                                         //check for null                                 
          file.size < this.MAX_SIZE &&                                    //check max File Size (1MB)          
          (file.type === "image/jpeg" || file.type === "image/jpeg") &&   //check for valid filetype (.jpg or .png)
          !file.name.includes("/") &&                                     //check for propably malicious delimiters e.g. “/file.jpg/index.php”
          !file.name.includes(";") &&                                     //check for propably malicious delimiters e.g. “file.asp;.jpg”
          !(file.name.indexOf(".", file.name.indexOf(".")+1) != -1)&&     //check for double extension attack e.g. image.pdf.png
          file.name.length < 34                                           //check if file name is reasonably short
          ) {
        this.currentFile = file;
        
        //file seems legit on first inspection so start upload
        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            //just a Progress bar - now web security related but a nice UX
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
            //when done uploading clear file and show done message:
            if(this.progress == 100) {
              this.currentFile = undefined;
              this.showMsg("Image successfully uploaded", "success")
            }

          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.status) {
              this.showMsg(err.error.status, "error");
            } else {
              this.showMsg('Could not upload the file!', "error");
            }
            this.currentFile = undefined;
          });
      }
      else {
        //error messages according to detected error
        if (file != null) {
          file.size < this.MAX_SIZE ? '' : this.showMsg("selected File is too big", "error");
          (file.type === "image/jpeg" || file.type === "image/jpeg") ? '' : this.showMsg("Not a valid Filetype - only .png and .jpg are accepted", "error");
          !file.name.includes("/") ? '' : this.showMsg("Filename contains unallowed character: '/'", "error");
          !file.name.includes(";") ? '' : this.showMsg("Filename contains unallowed character: ';'", "error");
          !(file.name.indexOf(".", file.name.indexOf(".")+1) != -1) ? '' : this.showMsg("Filename contains too many type declarations: e.g. 'image.pdf.png'", "error");
          file.name.length < 30 ? '' : this.showMsg("name of selected File is too long. Only 30 characters are allowed.", "error");
        }
        else this.showMsg("no File selected", "error")                                                                                
      }
      this.selectedFiles = undefined;
    }
  }

  /* Messages for Usernotification */
  showMsg(message: string, type: String){
    //errormsg
    if(type === "error") {
      this.errorMessage = message;
      this.successMessage = '';
      this.message = '';
      setTimeout(() => {
        this.errorMessage = ''
      }, 5000);
    }
    //successmsg
    else if(type === "success") {
        this.successMessage = message;
        this.errorMessage = '';
        this.message = '';
        setTimeout(() => {
          this.successMessage = ''
        }, 5000);
    }
    //defaultmsg
    else{
        this.message = message;
        this.errorMessage = '';
        this.successMessage = '';
        setTimeout(() => {
          this.message = ''
        }, 5000);
    }    
  }
}