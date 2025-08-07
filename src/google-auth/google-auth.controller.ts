// // import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// // import { GoogleAuthService } from './google-auth.service';
// // import { CreateGoogleAuthDto } from './dto/create-google-auth.dto';
// // import { UpdateGoogleAuthDto } from './dto/update-google-auth.dto';

// // @Controller('google-auth')
// // export class GoogleAuthController {
// //   constructor(private readonly googleAuthService: GoogleAuthService) {}

// //   @Post()
// //   create(@Body() createGoogleAuthDto: CreateGoogleAuthDto) {
// //     return this.googleAuthService.create(createGoogleAuthDto);
// //   }

// //   @Get()
// //   findAll() {
// //     return this.googleAuthService.findAll();
// //   }

// //   @Get(':id')
// //   findOne(@Param('id') id: string) {
// //     return this.googleAuthService.findOne(+id);
// //   }

// //   @Patch(':id')
// //   update(@Param('id') id: string, @Body() updateGoogleAuthDto: UpdateGoogleAuthDto) {
// //     return this.googleAuthService.update(+id, updateGoogleAuthDto);
// //   }

// //   @Delete(':id')
// //   remove(@Param('id') id: string) {
// //     return this.googleAuthService.remove(+id);
// //   }
// // }

// // src/auth/google-auth.controller.ts
// import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import type { Response } from 'express';
// // import { Response } from 'express';

// @Controller('auth/google')
// export class GoogleAuthController {
//   @Get()
//   @UseGuards(AuthGuard('google'))
//   async googleAuth() {
//     // Initiates the Google OAuth flow
//   }

//   @Get('callback')
//   @UseGuards(AuthGuard('google'))
//   async googleAuthRedirect(@Req() req, @Res() res: Response) {
//     // Handle the callback after Google has authenticated the user
//     const user = req.user;
    
//     // Store the access token securely (e.g., in a session or database)
//     // Then redirect to your frontend
//     res.redirect('/?googleAuthSuccess=true');
//   }
// }

// src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthService } from './google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {

  constructor(private readonly googleAuthService : GoogleAuthService){}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Triggers Google OAuth flow
  }

  // @Get('google/callback')
  @Get('/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { accessToken } = req.user;
    console.log('Access Token:', accessToken); // Log for testing
    // return this.googleAuthService.setGoogleAccessToken(4 , accessToken)
    return {accessToken}




    // return { accessToken };
  //   console.log(req.user)
  //   return {
  //     accessToken: req.user.accessToken, // Send to frontend or store in DB
  //     profile: req.user.profile,
  //   };
  // }
}
}
